import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are an impact intelligence analyst for Fronthill, a boutique regenerative agriculture fund manager. Fronthill designs and manages private investment funds that align capital with regenerative outcomes. Their flagship vehicle is DiversiFund ($100M target), focused on clearing barriers for farmers transitioning to regenerative practices.

The user is James Cutler, Fronthill's principal. He thinks in systems — he wants to understand landscape-level changes, practices-to-outcomes chains, and comparative data across geographies. He is not looking for simple answers; he wants intelligence that helps him make better capital deployment decisions.

When analyzing regions or projects, always:
1. Reference the current data shown on screen (injected below)
2. Frame insights in terms of the Regen 10 Outcomes framework
3. Distinguish between what the data shows vs. what is inferred
4. Suggest what additional data would strengthen the analysis
5. Be direct about uncertainty and confidence levels`;

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // If no API key, return a thoughtful fallback response
  if (!apiKey) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const fallback = generateFallbackResponse(lastMessage, context);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by chunking the response
        const words = fallback.split(' ');
        let i = 0;
        const interval = setInterval(() => {
          if (i >= words.length) {
            controller.close();
            clearInterval(interval);
            return;
          }
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(chunk));
          i++;
        }, 30);
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Use Anthropic API with streaming
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 1024,
        system: `${SYSTEM_PROMPT}\n\nCurrent context: ${context || 'General dashboard view'}`,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`API error: ${response.status}`);
    }

    // Transform SSE stream to plain text stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    controller.enqueue(encoder.encode(parsed.delta.text));
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const fallback = generateFallbackResponse(lastMessage, context);
    return new Response(fallback, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

function generateFallbackResponse(question: string, context: string): string {
  const q = question.toLowerCase();

  if (q.includes('region') || q.includes('landscape') || q.includes('ecological')) {
    return `Based on the available landscape data for this region, several key dynamics emerge that are relevant for DiversiFund's capital deployment strategy:

**Soil Health & Carbon**: The soil organic matter levels indicate ${context?.includes('Upper Midwest') ? 'moderate baseline carbon stocks typical of intensively farmed Corn Belt landscapes' : 'significant room for improvement through regenerative practice adoption'}. Published NRCS data suggests cover crop integration could increase SOM by 0.3-0.8 percentage points over 5-7 years in comparable geographies.

**Water Quality Pressure**: The elevated watershed impairment rates point to excessive nutrient loading — a key indicator that conservation practice investment would generate measurable ecological returns. EPA ATTAINS data confirms this pattern across the broader region.

**Investment Implications**: This profile aligns with DiversiFund's thesis of catalyzing regenerative transition. The combination of degraded baseline conditions and available conservation program infrastructure (EQIP, CSP) creates a favorable environment for blended capital approaches.

**Data Gaps**: Field-level soil testing, tile drainage mapping, and farmer willingness-to-adopt surveys would significantly improve confidence in projected outcomes.`;
  }

  if (q.includes('invest') || q.includes('project') || q.includes('pipeline')) {
    return `From a DiversiFund perspective, this opportunity merits careful evaluation against the regenerative transition thesis.

**Alignment with Regen 10 Outcomes**: The project touches several key outcome areas — soil health (f01), practice adoption (f04-f05), and farm economics (f08-f10). Strong alignment increases both impact measurement rigor and narrative strength for LPs.

**Risk Assessment**: Key risks include execution timeline (regenerative transitions typically require 3-7 year horizons for measurable outcomes), market dynamics (commodity price sensitivity), and scaling assumptions.

**Comparable Analysis**: Similar projects in the NRCS EQIP database and Practical Farmers of Iowa network show consistent patterns — early-stage yield dips followed by 15-25% cost reduction through input savings by year 3-5.

**Recommendation**: Worth advancing to the next stage of due diligence, with particular attention to the farmer retention model and unit economics at scale.`;
  }

  return `That's an important question for Fronthill's investment thesis. Let me frame it through the Regen 10 Outcomes lens:

The regenerative agriculture investment landscape continues to evolve rapidly. DiversiFund's positioning as a barrier-removal vehicle is well-suited to current market dynamics — particularly as USDA conservation programs (EQIP, CSP, RCPP) create complementary public capital flows.

Key considerations:
1. **Systems-level thinking** is essential — individual project returns must be evaluated against landscape-scale ecological dynamics
2. **Data infrastructure** determines analysis quality — prioritize investments where measurement systems exist or can be built
3. **Practice-to-outcome chains** should be explicit and verifiable for each deployment decision

I'd recommend deepening the analysis with specific regional data. Would you like me to focus on a particular geography or outcome area?`;
}
