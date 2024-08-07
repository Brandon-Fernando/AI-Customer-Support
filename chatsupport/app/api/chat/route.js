import { NextResponse } from "next/server"
import OpenAI from "openai";

const systemPrompt = `Welcome to HeadStarterAI Customer Support! I’m here to assist you with any questions or issues you may have regarding our AI-powered interview platform for software engineering jobs. How can I help you today? 
You can ask me about:
Account Management: Creating, accessing, or managing your HeadStarterAI account.
Interview Process: Information on how our AI-powered interviews work, including setup and preparation.
Technical Issues: Troubleshooting problems with the platform, such as login issues or interview interruptions.
Platform Features: Details on specific features of HeadStarterAI, like coding challenges, interview scheduling, or feedback reports.
Billing and Payments: Questions about subscription plans, payment methods, or billing issues.
General Inquiries: Any other questions you might have about using HeadStarterAI.
Before we get started:
For account-related issues, please have your account details ready.
If you’re experiencing a technical problem, try to describe the issue in detail so I can better assist you.
Let’s get started! How can I assist you today?`


export async function POST(req){
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
            role: 'system',
            content: systemPrompt,
            },
            ...data,
        ],
        model: 'gpt-4o-mini',
        stream: true
    })
    
    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if(content){
                        const cleanedContent = content.replace(/\*\*/g, '')
                        const text = encoder.encode(cleanedContent);
                        controller.enqueue(text)
                    }
                }
            }
            catch(error){
                controller.error(err)
            }finally {
                controller.close()
            }

        },
    })

    return new NextResponse(stream)
}