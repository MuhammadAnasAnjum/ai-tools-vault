---
slug: coze
name: Coze
vendor: ByteDance
category: Chatbot
functionalCategory: agent-builder
website: https://www.coze.com
metaTitle: "Coze Review 2026: ByteDance's Open-Source Agent Builder"
metaDescription: "Coze reviewed — how the visual agent builder works, what Coze Studio's Apache 2.0 release means for self-hosting, pricing, and the regional access problem."
h1: "Coze: A Visual Agent Builder You Can Also Self-Host"
primaryKeyword: coze review
secondaryKeywords: [coze studio open source, coze pricing, bytedance coze, coze self-hosted]
lastVerified: 2026-08-09
freeTier: true
startingPrice: "$0 (free, capped daily credits); Premium Plus around $39/month"
---

# Coze: A Visual Agent Builder You Can Also Self-Host

Coze is ByteDance's platform for building AI agents without writing much code — drag nodes onto a canvas, wire them together, attach plugins, and deploy the result to a messaging channel. Plenty of tools make that promise.

What makes Coze worth separate attention is that ByteDance open-sourced the core of it under Apache 2.0 in July 2025. You can run the whole thing on your own infrastructure, commercially, for free. Very few serious agent platforms offer that.

## What is Coze?

Coze is a low-code and no-code environment for building AI chatbots and agents. You compose an agent visually, giving it a prompt, a knowledge base, plugins for external actions, and workflow logic for multi-step behaviour, then publish it to a channel where your users already are.

Two editions exist and the distinction matters. The international platform at **coze.com** is operated by SPRING (SG) PTE. LTD., while China has a separate edition called **Kouzi** (扣子) delivered through Volcano Engine. This is not a China-only product, but the two editions are run separately.

The open-source story is the notable part. **Coze Studio** and **Coze Loop** were released under Apache 2.0 in July 2025, joining the earlier Eino framework. Self-hosting is free for commercial use. In the self-hosted edition models are not bundled — you supply your own API keys and activate models through ModelArk or Volcengine, which means you control both cost and data flow.

Pricing on the hosted platform includes a free plan with capped daily credits, plus Premium and Premium Plus tiers, with Premium Plus reported around $39 monthly. Exact current allowances are worth checking directly, since the widely republished figures are dated.

## Key Features

- **Visual agent builder** — compose agents on a canvas without writing code, with logic branching for multi-step behaviour.
- **Open source under Apache 2.0** — Coze Studio and Coze Loop can be self-hosted and used commercially at no licence cost.
- **Bring your own models** — in the self-hosted edition you supply API keys, controlling spend and data handling directly.
- **Plugin system** — connect agents to external services and APIs so they can act rather than only answer.
- **Knowledge bases** — ground agents in your own documents to reduce invented answers.
- **Workflow engine** — chain steps, conditions, and tool calls into reliable multi-stage processes.
- **Multi-channel publishing** — deploy finished agents to messaging platforms and embed them in products.
- **Coze Loop** — observability and evaluation tooling for agents you have shipped, which most no-code builders lack entirely.

## Pros and Cons

**The genuine advantages**

The Apache 2.0 release changes the calculation for anyone worried about platform dependency. If a vendor raises prices, changes terms, or discontinues a product, a self-hostable core means your agents survive. That is worth a great deal in a market where tools disappear regularly — as several entries in this directory demonstrate.

Bringing your own model keys is the second real advantage. You pay the model provider directly at cost rather than a marked-up platform rate, and for high-volume agents that difference compounds. It also means sensitive data can flow to a provider you have chosen and vetted rather than through an intermediary.

The builder itself is capable, the plugin system is broad, and Coze Loop's observability tooling is unusually mature for this category — most visual builders let you ship an agent and then leave you guessing about how it performs.

**The real constraints**

Regional availability is the first thing to check. Coze's own terms disclaim availability and note that features vary by jurisdiction, and users in some regions encounter a flat "our services are not available in your country or region." Before planning around the hosted platform, confirm you can actually reach it.

Pricing transparency is weak. The free and Premium credit allowances are not clearly published in a way that survives verification, and the frequently cited figures are old enough to be unreliable. Verify on coze.com before budgeting.

The open-source edition also has limits: some capabilities require paid Commercial Edition plugins, so "self-host it free" is true of the core but not of everything. And self-hosting means you own the operational burden — infrastructure, updates, and model key management become your responsibility, which is a real cost even when the licence is free.

Documentation for the international edition is thinner than for comparable Western platforms, and community resources are correspondingly sparser.

## How to Use Coze

1. **Check regional availability first** by visiting coze.com. If it is blocked where you are, the self-hosted route is your path rather than the hosted platform.
2. **Start hosted on the free plan** even if you intend to self-host eventually — learning the builder is much faster without infrastructure work in the way.
3. **Build one narrow agent** with a single clear job. Broad, vaguely defined agents are the most common cause of disappointing results.
4. **Attach a knowledge base early.** Grounding the agent in your own documents is the main defence against invented answers.
5. **Add plugins only once the conversation works.** Getting the dialogue right before adding actions makes debugging far simpler.
6. **Use Coze Loop to evaluate before you ship.** Shipping an agent without observability means finding out about failures from your users.
7. **Evaluate self-hosting deliberately** once something is working. Weigh the free licence against the real operational cost of running it, and check whether the plugins you depend on require the Commercial Edition.

### FAQs

**Is Coze free?**
The hosted platform has a free plan with capped daily credits, alongside Premium and Premium Plus tiers, with Premium Plus reported around $39 monthly. Separately, Coze Studio and Coze Loop are open source under Apache 2.0 and free for commercial self-hosting — though in that case you supply and pay for your own model API keys, and some plugins require the paid Commercial Edition. Verify current hosted allowances on coze.com, as published figures are inconsistent.

**Is Coze available outside China?**
Yes. The international platform runs at coze.com, operated by SPRING (SG) PTE. LTD., separately from China's Kouzi edition delivered via Volcano Engine. However, access is gated in some regions, and Coze's terms explicitly state that availability and features vary by jurisdiction. Check whether you can reach the site before planning around it.

**What does open-sourcing Coze Studio actually give me?**
The ability to run the agent-building platform on your own infrastructure, commercially, without a licence fee, using model keys you control. That removes vendor dependency and gives you direct control over data flow and model costs. The trade-off is that you take on hosting, updates, and operations, and some capabilities still require paid Commercial Edition plugins.

**Coze or Chatbase for a support bot?**
Chatbase is faster to stand up for straightforward documentation-based support, with less configuration and a clearer path from upload to live widget. Coze is more powerful for agents needing multi-step workflows, custom plugins, or self-hosting, but requires more setup. Choose Chatbase for speed, Coze for control.

---

*Pricing, editions, and open-source status verified August 2026. Hosted credit allowances are published inconsistently and regional access varies — confirm on coze.com before committing.*
