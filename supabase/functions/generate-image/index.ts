import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images, prompt } = await req.json();
    
    if (!images || !Array.isArray(images) || images.length === 0 || !prompt) {
      throw new Error('Missing images array or prompt');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating HD image from', images.length, 'images with prompt:', prompt);

    // Build content array with prompt text and all images
    const content = [
      {
        type: 'text',
        text: `IMPORTANT: Generate an ultra high definition, full HD quality image. Follow these exact instructions: ${prompt}. 

Use these ${images.length} image(s) and create output exactly as described in the prompt. The prompt may be in any language including Hindi - follow it precisely. Generate with maximum quality, detail, and resolution. Ultra high resolution output required.`
      },
      ...images.map((imageData: string) => ({
        type: 'image_url',
        image_url: {
          url: imageData
        }
      }))
    ];

    // Call Lovable AI image generation endpoint with HD quality
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the generated image URL from the response
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      throw new Error('No image URL in AI response');
    }

    return new Response(
      JSON.stringify({ imageUrl: generatedImageUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
