import { config, fields, singleton } from '@keystatic/core';

const isProduction = process.env.NODE_ENV === 'production';
const hasGitHubConfig = !!process.env.KEYSTATIC_GITHUB_CLIENT_ID;

export default config({
  storage: (isProduction && hasGitHubConfig)
    ? {
        kind: 'github',
        repo: 'ishmaelharrydeckor/sammy',
      }
    : {
        kind: 'local',
      },
  singletons: {
    siteContent: singleton({
      label: 'Site Content',
      path: 'src/data/site-content',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          subtitle: fields.text({ label: 'Subtitle' }),
          headline: fields.text({ label: 'Headline', multiline: true }),
          subtext: fields.text({ label: 'Subtext', multiline: true }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
          image: fields.image({
            label: 'Hero Image',
            directory: 'public/images',
            publicPath: '/images',
          }),
          video: fields.file({
            label: 'Hero Background Video (MP4)',
            directory: 'public/videos',
            publicPath: '/videos',
          }),
          credentials: fields.array(
            fields.object({
              label: fields.text({ label: 'Label' }),
              value: fields.text({ label: 'Value' }),
            }, {
              label: 'Credential Pair'
            }),
            {
              label: 'Credentials',
              itemLabel: (item) => `${item.fields.label.value}: ${item.fields.value.value}`,
            }
          ),
          locations: fields.text({ label: 'Locations Text' }),
        }, {
          label: 'Hero Section'
        }),
        intro: fields.object({
          title: fields.text({ label: 'Title' }),
          paragraph: fields.text({ label: 'Paragraph', multiline: true }),
        }, {
          label: 'Intro Section'
        }),
        about: fields.object({
          badge: fields.text({ label: 'Badge' }),
          sidebarHeading: fields.text({ label: 'Sidebar Heading' }),
          sidebarSub: fields.text({ label: 'Sidebar Sub-heading' }),
          heading: fields.text({ label: 'Heading', multiline: true }),
          portraitImage: fields.image({
            label: 'Portrait Image',
            directory: 'public/images',
            publicPath: '/images',
          }),
          paragraphs: fields.array(fields.text({ label: 'Paragraph Text', multiline: true }), {
            label: 'About Paragraphs',
            itemLabel: (item) => item.value ? (item.value.substring(0, 50) + '...') : 'Paragraph',
          }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
        }, {
          label: 'About Section'
        }),
        programs: fields.object({
          title: fields.text({ label: 'Title' }),
          subtitle: fields.text({ label: 'Subtitle' }),
          offers: fields.array(
            fields.object({
              badge: fields.text({ label: 'Badge' }),
              title: fields.text({ label: 'Title' }),
              description: fields.text({ label: 'Description', multiline: true }),
              featuresTitle: fields.text({ label: 'Features Title' }),
              features: fields.array(fields.text({ label: 'Feature Item' }), {
                label: 'Features List',
                itemLabel: (item) => item.value || 'Feature',
              }),
              ctaText: fields.text({ label: 'CTA Button Text' }),
              closing: fields.text({ label: 'Closing Text (Optional)' }),
            }, {
              label: 'Offer Detail'
            }),
            {
              label: 'Offers',
              itemLabel: (item) => item.fields.title.value || 'Offer',
            }
          ),
        }, {
          label: 'Work With Samuel Section'
        }),
        book: fields.object({
          title: fields.text({ label: 'Title' }),
          author: fields.text({ label: 'Author' }),
          coverImage: fields.image({
            label: 'Book Cover Image',
            directory: 'public/images',
            publicPath: '/images',
          }),
          description: fields.text({ label: 'Description', multiline: true }),
          quote: fields.text({ label: 'Featured Quote', multiline: true }),
          quoteSource: fields.text({ label: 'Quote Source' }),
          status: fields.text({ label: 'Release Status/Subtext' }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
        }, {
          label: 'Book Showcase Section'
        }),
        events: fields.object({
          title: fields.text({ label: 'Title' }),
          headline: fields.text({ label: 'Event Headline' }),
          locationTime: fields.text({ label: 'Location & Time Info' }),
          description: fields.text({ label: 'Description', multiline: true }),
          ctaText: fields.text({ label: 'CTA Button Text' }),
        }, {
          label: 'Event Highlights Section'
        }),
        videoInsights: fields.object({
          title: fields.text({ label: 'Section Title' }),
          description: fields.text({ label: 'Section Description', multiline: true }),
          items: fields.array(
            fields.object({
              title: fields.text({ label: 'Video Title' }),
              desc: fields.text({ label: 'Video Description', multiline: true }),
              url: fields.text({ label: 'YouTube Video Link' }),
              tag: fields.text({ label: 'Category/Tag' }),
            }, {
              label: 'Video Item'
            }),
            {
              label: 'Featured Videos',
              itemLabel: (item) => item.fields.title.value || 'Video',
            }
          ),
        }, {
          label: 'Featured Video Insights Section'
        }),
        testimonials: fields.object({
          title: fields.text({ label: 'Section Title' }),
          items: fields.array(
            fields.object({
              quote: fields.text({ label: 'Client Quote', multiline: true }),
              author: fields.text({ label: 'Client Name/Author' }),
            }, {
              label: 'Testimonial Item'
            }),
            {
              label: 'Testimonials List',
              itemLabel: (item) => item.fields.author.value || 'Testimonial',
            }
          ),
        }, {
          label: 'Testimonials Section'
        }),
        contact: fields.object({
          title: fields.text({ label: 'Section Title' }),
          description: fields.text({ label: 'Section Description', multiline: true }),
          form: fields.object({
            nameLabel: fields.text({ label: 'Name Input Label' }),
            emailLabel: fields.text({ label: 'Email Input Label' }),
            subjectLabel: fields.text({ label: 'Subject Input Label' }),
            subjectOptions: fields.array(fields.text({ label: 'Subject Dropdown Option' }), {
              label: 'Subject Dropdown Options',
              itemLabel: (item) => item.value || 'Option',
            }),
            messageLabel: fields.text({ label: 'Message Textarea Label' }),
            ctaText: fields.text({ label: 'Send Button Text' }),
          }, {
            label: 'Form Settings'
          }),
        }, {
          label: 'Contact Section'
        }),
        footer: fields.object({
          connectTitle: fields.text({ label: 'Connect Header Title' }),
          connectDescription: fields.text({ label: 'Connect Description Text', multiline: true }),
          socials: fields.array(
            fields.object({
              name: fields.text({ label: 'Social Platform Name' }),
              url: fields.text({ label: 'Link URL' }),
            }, {
              label: 'Social Profile Item'
            }),
            {
              label: 'Social Profiles',
              itemLabel: (item) => item.fields.name.value || 'Profile',
            }
          ),
          copyright: fields.text({ label: 'Copyright String' }),
        }, {
          label: 'Footer Settings'
        }),
      },
    }),
  },
});
