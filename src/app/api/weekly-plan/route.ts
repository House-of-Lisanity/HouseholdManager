import { NextRequest, NextResponse } from 'next/server';
import { WeeklyFormInput, WeeklyPlanResult } from '@/types';
import { buildPromptFromFormData } from '@/lib/prompt-builder';
import { generatePlanFromLLM } from '@/lib/llm-client';

export async function POST(request: NextRequest) {
  try {
    const formData: WeeklyFormInput = await request.json();
    
    const prompt = buildPromptFromFormData(formData);
    
    const llmResponse = await generatePlanFromLLM(prompt);
    
    const planResult: WeeklyPlanResult = JSON.parse(llmResponse);
    
    return NextResponse.json(planResult);
  } catch (error) {
    console.error('Error generating weekly plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate weekly plan' },
      { status: 500 }
    );
  }
}
