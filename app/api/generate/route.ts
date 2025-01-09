import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const response = await fetch(
      "https://api.segmind.com/v1/sdxl1.0-realdream-pony-v9",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.SEGMIND_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: "bad quality, worse quality, low quality",
          samples: 1,
          scheduler: "UniPC",
          num_inference_steps: 25,
          guidance_scale: 7.5,
          strength: 1,
          seed: Math.floor(Math.random() * 1000000),
          img_width: 1024,
          img_height: 1024,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const imageData = await response.blob()
    const base64Data = Buffer.from(await imageData.arrayBuffer()).toString('base64')

    return NextResponse.json({ 
      success: true, 
      image: `data:image/jpeg;base64,${base64Data}` 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

