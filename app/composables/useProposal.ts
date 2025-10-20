import type { ProposalSection, ProposalClosing } from '@@/types/proposal'

export const useProposal = () => {
  const sections: ProposalSection[] = [
    {
      id: 'intro',
      title: 'TiffyCooks Community — Powered by PCL Labs',
      subtitle: 'A new platform for creators to learn, share, and grow — launching January 2026',
      blocks: [
        {
          id: 'intro-narrative',
          text: 'Concept led by Julia, the creative strategist behind tiffycooks.com\'s growth and monetization success. Julia now leads this next phase under the PCL Labs agency model, with full technical and operational support from the PCL Labs team. Team: Julia (Creative & Growth), Chris (CTO), Danny (Developer).',
        },
        {
          id: 'proposal-intro',
          text: 'Together, the team brings the structure, design, and engineering needed to launch a scalable, standalone learning community for creators inspired by your journey. You focus on creating and sharing — we handle the technology from start to finish.',
        },
      ],
    },
    {
      id: 'vision',
      title: 'From personal storytelling → creator education → lasting enterprise value',
      blocks: [
        {
          id: 'concept',
          text: 'We\'ll build a modern creator community where passionate storytellers can learn how to grow their own blogs and creative platforms, share personal experiences from the blogging journey, connect with others building around their passions, and access both free ad-supported resources and deeper membership-based education.',
        },
        {
          id: 'monetization-strategy',
          text: 'The platform will launch under learn.tiffycooks.com, then redirect to a new independent domain for clean ownership and resale flexibility — preserving SEO continuity, brand trust, and discoverability while establishing the new community as its own standalone property.',
        },
        {
          id: 'scale',
          text: 'PCL Labs manages the full technical ecosystem — from hosting to app deployment — so you can focus entirely on content and community.',
        },
      ],
    },
    {
      id: 'platform',
      title: 'A PWA learning and publishing platform built for engagement, SEO, and app distribution',
      blocks: [
        {
          id: 'platform-overview',
          text: 'Website & CMS — A fully functional, mobile-optimized platform launched under learn.tiffycooks.com and connected to a dedicated standalone domain for long-term growth and ownership. Includes a simple content management system for publishing and organizing posts, lessons, and updates.',
        },
        {
          id: 'ai-integration',
          text: 'Content Strategy & Management Support — Julia leads ongoing content organization, publishing cadence, and marketing strategy and support, ensuring new lessons and creator stories are launched consistently and aligned with growth goals.',
        },
        {
          id: 'monetization-infrastructure',
          text: 'Advertising Integration (Raptive Partnership) — Ad placements configured (in collaboration with Raptive) for clean UX, optimized performance, and seamless revenue tracking. Community engagement tools foster audience interaction and feedback. Analytics setup includes Search Console, Google Analytics, and ad performance tracking.',
        },
        {
          id: 'strategic-goal',
          text: 'PWA Delivery & Technical Management (PCL Labs) — Progressive Web App experience optimized for iOS and Android. Hosting, maintenance, updates, and all technical operations fully managed by PCL Labs — so you can focus entirely on content and community.',
        },
      ],
    },
    {
      id: 'revenue',
      title: 'Sustainable, diversified revenue — without sponsorships or affiliates',
      blocks: [
        {
          id: 'streams',
          heading: 'Revenue Streams',
          type: 'revenue',
          data: [
            {
              stream: 'Google Ads',
              description: 'Monetize free educational and community content with optimized placements',
              target: '$20K–25K/mo',
            },
            {
              stream: 'Memberships',
              description: 'Paid tiers for exclusive courses and membership features',
              target: '$10K–15K/mo',
            },
            {
              stream: 'Total Projected',
              description: 'Combined recurring revenue (ads + memberships)',
              target: '$30K–40K/month recurring',
            },
          ],
          footer: 'All ad management and optimization handled by PCL Labs — so you can focus on creative leadership, not ad logistics.',
        },
      ],
    },
    {
      id: 'financial-impact',
      title: 'A new, stand-alone digital property that grows value from day one.',
      blocks: [
        {
          id: 'structure',
          heading: 'Highlights',
          list: [
            'Built under learn.tiffycooks.com and transitioned to its own domain — easy to manage and sell independently',
            'Strong SEO + app visibility — high recurring traffic and engagement potential',
            'Diversified, recurring revenue (ads + memberships)',
            'Demonstrates scalable, creator-focused community tech — highly attractive to acquirers',
            'Hands-free infrastructure: PCL Labs handles development, hosting, CMS, analytics, and growth systems',
          ],
        },
        {
          id: 'valuation',
          heading: 'Valuation upside',
          type: 'kpi',
          data: [
            {
              title: 'Estimated 2-year profit',
              value: '$400K–$500K+',
              description: 'Cumulative profit estimate',
            },
            {
              title: 'Enterprise value add',
              value: '$2M+',
              description: 'Based on 4–6× multiple',
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
      title: 'Aligned incentives — with agency structure and single-point creative leadership.',
      blocks: [
        {
          id: 'pcl-responsibilities',
          text: 'We’ll run this under our agency model so you get secure and transparent billing and contracts, a defined scope with clear accountability, full technical, design, and growth resources under one structure, and a single creative lead and point of contact (Julia).',
        },
        {
          id: 'tiffy-role',
          text: 'Julia continues as your lead creative and project manager under the PCL Labs umbrella — the same partner who built tiffycooks.com’s growth success. PCL Labs provides full backend, technical, and operational support from Chris (CTO) and Danny (Developer). This model allows you to focus entirely on storytelling and content, while PCL Labs handles everything technical — from build to growth optimization.',
        },
        {
          id: 'financial-terms',
          heading: 'Financial Terms',
          type: 'financial-terms',
          data: [
            {
              term: 'Build & Launch Fee (Milestone-Based)',
              description: 'Phase 1 – MVP Launch (Jan 2026): $12,000; Phase 2 – Membership Add-On (Post-Launch): $6,000',
              amount: '$18,000 total',
            },
            {
              term: 'Revenue Share',
              description: 'Share of all platform revenue (ads + memberships) for ongoing support and optimization',
              amount: '25% for 2 years',
            },
            {
              term: 'Buyout at Sale',
              description: '2× trailing 12-month average of PCL’s share',
              amount: '2× PCL’s share',
            },
          ],
        },
        {
          id: 'timeline-details',
          heading: 'Project Timeline',
          type: 'timeline',
          data: [
            { phase: 'Discovery & Architecture', dates: 'Nov 2025', deliverables: 'Finalize features, tech stack, CMS structure, and domain setup (learn.tiffycooks.com + redirect plan)' },
            { phase: 'Development & Testing', dates: 'Nov–Dec 2025', deliverables: 'MVP build (community + CMS + ads)' },
            { phase: 'MVP Launch', dates: 'Jan 2026', deliverables: 'Public launch under learn.tiffycooks.com with redirect to new domain' },
            { phase: 'Membership Feature Development', dates: 'Feb–Apr 2026', deliverables: 'Build and release membership system (saved lessons, exclusive courses)' },
            { phase: 'Optimization & Growth', dates: 'Feb–Dec 2026', deliverables: 'SEO, retention, ad optimization, reporting' },
            { phase: 'Sale Preparation', dates: '2027', deliverables: 'Handoff documentation, valuation support' },
          ],
        },
      ],
    },
  ]

  const closing: ProposalClosing = {
    title: 'TiffyCooks x PCL Labs — Build. Grow. Exit.',
    quote: 'A scalable, ad-supported learning community built on Tiffy’s storytelling — and designed for long-term value.',
  }

  return {
    sections,
    closing,
  }
}
