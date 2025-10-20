<script setup lang="ts">
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@vue-email/components'

defineProps<{
  userName: string
  userEmail: string
  teamName?: string
  message: string
}>()
</script>

<template>
  <Html>
    <Head />
    <Preview>Meeting Request from {{ userName }} - TiffyCooks Proposal</Preview>
    <Body style="background-color: #f6f9fc; font-family: sans-serif;">
      <Container style="margin: 0 auto; padding: 20px 0 48px; max-width: 560px;">
        <Img
          src="/logo.png"
          width="42"
          height="42"
          alt="TiffyCooks"
          style="margin: 0 auto;"
        />
        <Heading
          style="
            color: #333;
            font-size: 24px;
            letter-spacing: -0.5px;
            line-height: 1.3;
            font-weight: 400;
            margin: 40px 0 20px;
            text-align: center;
          "
        >
          Meeting Request from {{ userName }}
        </Heading>

        <Section style="margin: 20px 0;">
          <Text style="color: #333; font-size: 16px; line-height: 1.4; margin: 16px 0;">
            {{ userName }} ({{ userEmail }}) has requested a meeting to discuss the TiffyCooks Community proposal.
          </Text>
        </Section>

        <Section style="margin: 20px 0;">
          <Heading
            style="
              color: #333;
              font-size: 18px;
              font-weight: 600;
              margin: 20px 0 10px;
            "
          >
            Message:
          </Heading>
          <Text style="color: #333; font-size: 16px; line-height: 1.4; margin: 16px 0; background-color: #f8f9fa; padding: 16px; border-radius: 8px;">
            {{ message }}
          </Text>
        </Section>

        <Section style="margin: 20px 0;">
          <Heading
            style="
              color: #333;
              font-size: 18px;
              font-weight: 600;
              margin: 20px 0 10px;
            "
          >
            User Details:
          </Heading>
          <Text style="color: #333; font-size: 16px; line-height: 1.4; margin: 8px 0;">
            <strong>Name:</strong> {{ userName }}
          </Text>
          <Text style="color: #333; font-size: 16px; line-height: 1.4; margin: 8px 0;">
            <strong>Email:</strong> {{ userEmail }}
          </Text>
          <Text v-if="teamName" style="color: #333; font-size: 16px; line-height: 1.4; margin: 8px 0;">
            <strong>Team:</strong> {{ teamName }}
          </Text>
        </Section>

        <Section style="margin: 30px 0;">
          <Text style="color: #333; font-size: 16px; line-height: 1.4; margin: 16px 0;">
            Reply to this email to respond directly to {{ userName }}.
          </Text>
        </Section>

        <Section style="margin: 30px 0; text-align: center;">
          <Link
            href="mailto:{{ userEmail }}"
            style="
              background-color: #007ee6;
              border-radius: 4px;
              color: #fff;
              font-size: 16px;
              font-weight: 400;
              text-decoration: none;
              text-align: center;
              display: inline-block;
              padding: 12px 20px;
            "
          >
            Reply to {{ userName }}
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
