import type { ProposalSection, ProposalClosing } from '@@/types/proposal'

export const useProposal = () => {
  const sections: ProposalSection[] = [
    {
      id: 'intro',
      title: 'TiffyCooks Community — Powered by PCL Labs',
      subtitle: 'A new platform for food lovers to learn, share, and grow — launching January 2026',
      blocks: [
        {
          id: 'intro-narrative',
          text: 'We\'re PCL Labs, the growth and technology team that has already transformed tiffycooks.com into a powerhouse. Our core team of Julia (Growth & Strategy), Chris (CTO), and Danny (Developer) has scaled your site to over 1 million daily visitors and $30,000+ monthly Google Ads revenue.',
        },
        {
          id: 'proposal-intro',
          text: 'Now we want to take the next step: building a standalone community platform that creates new revenue streams while protecting and enhancing your core brand. This isn\'t just another website—it\'s a strategic business expansion that positions you for significant growth and potential acquisition.',
        },
      ],
    },
    {
      id: 'vision',
      title: 'Turn fans into community — and community into sustainable revenue.',
      blocks: [
        {
          id: 'concept',
          text: 'We\'ll build a standalone food community platform that transforms your passionate audience into an engaged, monetizable community. Users will learn from your recipes, share their own variations, and connect with each other—all while an AI cooking assistant trained on your style and recipes helps members cook smarter and stay engaged.',
        },
        {
          id: 'monetization-strategy',
          text: 'The platform will maintain your proven SEO strategy with free, ad-supported content while introducing premium membership tiers for exclusive recipes, live Q&A sessions, and advanced features. This dual approach maximizes both reach and revenue.',
        },
        {
          id: 'scale',
          text: 'Built for maximum flexibility and growth, the platform will be hosted on a new domain (allowing for independent sale) while being strategically linked from learn.tiffycooks.com to maintain SEO crawlability and audience continuity.',
        },
      ],
    },
    {
      id: 'platform',
      title: 'A modern, SEO-optimized community platform — built for engagement and monetization.',
      blocks: [
        {
          id: 'platform-overview',
          text: 'The platform combines the best of community engagement with proven monetization strategies. Users will have personal dashboards to save recipes, share their own creations, and interact with your content through comments and discussions.',
        },
        {
          id: 'ai-integration',
          text: 'Our "Ask Tiffy" AI chatbot, trained specifically on your cooking style and recipes, will provide personalized cooking assistance and help users discover new content. This creates a unique value proposition that keeps users engaged and coming back.',
        },
        {
          id: 'monetization-infrastructure',
          text: 'The platform includes seamless Google Ads integration for free content, payment processing for premium memberships, and advanced SEO optimization to ensure maximum discoverability and revenue potential.',
        },
        {
          id: 'strategic-goal',
          text: 'Our goal is to build an owned audience layer that\'s searchable, interactive, and highly valuable to potential acquirers. This positions you not just as a content creator, but as the owner of a thriving digital community business.',
        },
      ],
    },
    {
      id: 'revenue',
      title: 'Blending reach and retention — ad-supported + member-supported.',
      blocks: [
        {
          id: 'streams',
          heading: 'Revenue Streams',
          type: 'revenue',
          data: [
            {
              stream: 'Google Ads',
              description: 'Monetize free content, user recipes, and community discussions',
              target: '$20K–25K/mo',
            },
            {
              stream: 'Memberships',
              description: 'Paid tiers for exclusive recipes, live Q&A, and premium features',
              target: '$10K–15K/mo',
            },
            {
              stream: 'Affiliate / Brand Partnerships',
              description: 'Integrated product links and sponsored content',
              target: '$5K–10K/mo',
            },
            {
              stream: 'Total Goal',
              description: 'Combined recurring + ad revenue',
              target: '$35K–50K/mo',
            },
          ],
          footer: 'All managed by PCL Labs under one integrated system.',
        },
      ],
    },
    {
      id: 'financial-impact',
      title: 'A new revenue engine — and a clean, sellable asset.',
      blocks: [
        {
          id: 'structure',
          heading: 'Structure',
          list: [
            'Built on a separate domain (e.g. tiffycookscommunity.com)',
            'Redirected from a tiffycooks.com subdomain for traffic + crawlability',
            'Fully ownable and transferrable at sale',
            'Ads + community continue earning even if core brand is sold separately',
          ],
        },
        {
          id: 'valuation',
          heading: 'Valuation upside',
          type: 'kpi',
          data: [
            {
              title: '2-Year Profit',
              value: '$500K+',
              description: 'Estimated cumulative profit',
            },
            {
              title: 'Enterprise Value',
              value: '$2–3M',
              description: 'Added value at 4–6× multiple',
            },
            {
              title: 'Strategic Value',
              value: 'High',
              description: 'Diversifies monetization, strengthens buyer appeal',
            },
          ],
        },
      ],
    },
    {
      id: 'partnership',
      title: 'Simple, aligned structure for focus and growth.',
      blocks: [
        {
          id: 'pcl-responsibilities',
          text: 'PCL Labs will handle all technical development, ongoing maintenance, SEO infrastructure, ad integration and optimization, growth analytics and reporting, plus community moderation tools and AI integration. We\'ll manage the entire technical ecosystem so you can focus on what you do best.',
        },
        {
          id: 'tiffy-role',
          text: 'Your role will be focused on creative direction, branding, and community engagement—the areas where your expertise and personal connection with your audience create the most value. We\'ll handle the technical complexity while you drive the creative vision.',
        },
        {
          id: 'financial-terms',
          heading: 'Financial Terms',
          type: 'financial-terms',
          data: [
            {
              term: 'Build & Launch Fee',
              description: 'One-time development and launch cost',
              amount: '$18,000',
            },
            {
              term: 'Revenue Share',
              description: 'Percentage of total platform revenue',
              amount: '25% for 2 years',
            },
            {
              term: 'Optional Buyout',
              description: 'At sale, multiple of trailing 12-month average',
              amount: '2× PCL\'s share',
            },
          ],
        },
        {
          id: 'timeline-details',
          heading: 'Project Timeline',
          type: 'timeline',
          data: [
            { phase: 'Discovery & Architecture', dates: 'Nov 2025', deliverables: 'Define features, tech stack, domain setup' },
            { phase: 'Development & Integration', dates: 'Nov–Dec 2025', deliverables: 'Platform build, user accounts, AI training, ad setup' },
            { phase: 'Launch', dates: 'Jan 2026', deliverables: 'Public rollout + soft community launch' },
            { phase: 'Optimization & Growth', dates: 'Feb–Dec 2026', deliverables: 'SEO, content scaling, reporting' },
            { phase: 'Sale Prep', dates: '2027', deliverables: 'Clean data, analytics handoff, valuation package' },
          ],
        },
      ],
    },
  ]

  const closing: ProposalClosing = {
    title: 'TiffyCooks x PCL Labs — Build. Grow. Exit.',
    quote: 'A community built on Tiffy\'s creativity — and powered by data, engagement, and smart monetization.',
  }

  return {
    sections,
    closing,
  }
}
