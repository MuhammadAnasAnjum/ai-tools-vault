---
slug: github-copilot
name: GitHub Copilot
vendor: GitHub (Microsoft)
category: Chatbot
functionalCategory: coding
website: https://github.com/features/copilot
metaTitle: "GitHub Copilot Review 2026: Plans, Credits, Security"
metaDescription: "GitHub Copilot reviewed — the Free to Enterprise tiers, the shift to AI Credits, agent mode across IDEs, and the security research worth reading first."
h1: "GitHub Copilot: The Default AI Coding Assistant, Warts Included"
primaryKeyword: github copilot review
secondaryKeywords: [github copilot pricing, copilot ai credits, github copilot free, copilot security]
lastVerified: 2026-08-09
freeTier: true
startingPrice: "$0 (free tier); Pro $10/month, free for verified students"
---

# GitHub Copilot: The Default AI Coding Assistant, Warts Included

GitHub Copilot is the tool that made AI code completion normal. It is now the default in most organisations, not because it always wins comparisons, but because it is already in the IDE and already in the enterprise agreement.

That ubiquity makes an honest review more useful than a promotional one. Copilot is very good at what it does, its billing model is mid-transition and genuinely confusing right now, and the security research on its output deserves attention before you let it write anything important.

Note for clarity: this covers **GitHub Copilot**, the coding assistant. Microsoft 365 Copilot is a different product with its own review in this directory.

## What is GitHub Copilot?

GitHub Copilot is an AI assistant for writing code. It began as inline autocomplete — suggesting the rest of a line or function as you type — and has grown into a set of tools spanning chat, autonomous agents, code review, and a command-line interface.

Copilot Chat includes a **multi-model picker** rather than locking you to one provider. Claude Sonnet 5 became generally available in June 2026 with Zero Data Retention and an admin model policy for Business and Enterprise accounts, alongside GPT and Gemini family models. Pro+ unlocks the full model range.

**Agent mode** is where the product has moved. Rather than completing your line, an agent takes a described task, works across multiple files, and produces a change for review. It became an integrated agent in JetBrains IDEs in June 2026, with Claude available as an agent provider in public preview.

Plans run: **Free** at $0 with roughly 2,000 completions and 50 agent requests monthly; **Pro** at $10/month or $100/year; **Pro+** at $39/month; **Business** at $19/user/month; **Enterprise** at $39/user/month, which requires GitHub Enterprise Cloud on top. Verified students, teachers, and popular open-source maintainers get Pro free through GitHub Education — one of the better deals in this directory.

## Key Features

- **Inline completion** — still the highest-value feature day to day, and unlimited on paid plans.
- **Agent mode** — assign a task and receive a multi-file change set, now integrated across VS Code, JetBrains, and Visual Studio.
- **Multi-model chat** — choose between Claude, GPT, and Gemini models rather than accepting one vendor's.
- **Copilot CLI** — terminal assistance, including a `/remote` command to steer sessions from github.com or GitHub Mobile.
- **AI code review** — automated pull request review that catches routine issues before a human reads the diff.
- **Cloud coding agent** — assign an issue and have work done asynchronously outside your local machine.
- **Broad IDE support** — VS Code, JetBrains IDEs, Visual Studio, plus github.com, GitHub Mobile, and Raycast.
- **Free for students and teachers** via GitHub Education verification.

## Pros and Cons

**Why it dominates**

Completion quality within a real codebase is the core strength, because Copilot sees your open files and project conventions and suggests code that fits them rather than generic examples. For boilerplate, tests, and unfamiliar API surfaces, it removes a lot of tedium.

The multi-model picker is a genuine advantage over single-vendor tools — if Claude handles your refactoring better and GPT handles your SQL better, you use both without a second subscription. Integration breadth is unmatched: whatever IDE your team uses, Copilot is likely already supported, and Business and Enterprise tiers bring the admin controls and model policies that procurement asks about. Free Pro access for students and teachers is straightforwardly generous.

**What to weigh seriously**

The billing model is changing and currently hard to pin down. Legacy premium request allowances — 300 on Pro, 1,500 on Pro+, 300 per user on Business, 1,000 on Enterprise, with overage around $0.04 each — are being superseded by **GitHub AI Credits**, and the pricing page now describes chat, agent mode, code review, cloud agent, CLI, and Copilot Apps as consuming credits. Code completions remain unlimited on paid plans. The specific per-plan credit allowances circulating in third-party articles conflict with each other, so check github.com/features/copilot/plans directly rather than trusting any comparison table, including this one.

Security deserves genuine attention. A peer-reviewed study of 733 Copilot-generated snippets found in real repositories identified security weaknesses in **29.5% of Python and 24.2% of JavaScript samples**. Encouragingly, feeding static-analysis warnings back to the model fixed up to 55.5% of them — which is the practical takeaway: run your linters and scanners over AI-generated code, because they catch a meaningful share of what it gets wrong. Broader reviews also flag prompt injection and data leakage risks.

The licensing question remains open. *Doe v. GitHub, Microsoft, and OpenAI*, a class action filed in November 2022, alleges that training on public repositories violated open-source licence terms. Organisations with strict licence compliance requirements should follow it rather than assume it is settled.

Enterprise pricing is also less transparent than it looks: the $39 per user figure sits on top of GitHub Enterprise Cloud at roughly $21 per user, so budget accordingly.

## How to Use GitHub Copilot

1. **Check whether you qualify for free Pro** through GitHub Education as a student, teacher, or notable open-source maintainer before paying anything.
2. **Install the extension for your IDE** and start with the Free tier if you are unsure — 2,000 completions monthly is enough to form a judgement.
3. **Write descriptive function names and signatures first.** Copilot infers intent from surrounding code, so good naming produces markedly better suggestions.
4. **Use chat for explanation, not just generation.** Asking it to explain an unfamiliar codebase section is one of its most reliable uses.
5. **Switch models when output disappoints.** The picker exists for a reason, and different models genuinely handle different languages and tasks differently.
6. **Run static analysis over everything it writes.** Given roughly a quarter to a third of generated snippets carrying weaknesses in published research, and given that feeding warnings back fixes over half, this is the single highest-value habit.
7. **Review agent output as you would a colleague's pull request.** Agent mode produces plausible multi-file changes, and plausible is not the same as correct.

### FAQs

**Is GitHub Copilot free?**
There is a Free tier with roughly 2,000 code completions and 50 agent requests monthly. Beyond that, Pro is $10/month or $100/year, Pro+ is $39/month, Business is $19/user/month, and Enterprise is $39/user/month plus GitHub Enterprise Cloud. Verified students, teachers, and popular open-source maintainers get Pro at no cost through GitHub Education.

**What are GitHub AI Credits?**
They are replacing the older premium request allowances as Copilot's metering system. Chat, agent mode, code review, the cloud agent, CLI, and Copilot Apps consume credits, while code completions stay unlimited on paid plans. The per-plan credit amounts reported by third-party sites conflict, so confirm current allowances on GitHub's official plans page before budgeting.

**Is code from GitHub Copilot secure?**
Not automatically. Peer-reviewed research examining 733 Copilot-generated snippets in real repositories found security weaknesses in 29.5% of Python and 24.2% of JavaScript samples. The same research found that feeding static-analysis warnings back to the model resolved up to 55.5% of them. Treat generated code as a draft requiring the same review and scanning you would apply to any contribution.

**Is there a legal problem with Copilot and open-source licences?**
There is unresolved litigation. *Doe v. GitHub, Microsoft, and OpenAI*, filed in November 2022, alleges that training on public repositories breached open-source licence terms. Nothing has definitively settled the question. If your organisation has strict licence compliance obligations, treat this as an open risk to monitor rather than a closed matter.

---

*Plans, models, and research findings verified August 2026. Copilot's metering is mid-transition from premium requests to AI Credits and third-party figures conflict — confirm current allowances on GitHub's official plans page.*
