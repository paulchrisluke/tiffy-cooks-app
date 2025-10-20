<template>
  <div>
    <header class="px-4">
      <WebsiteSection class="flex w-full items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/pcl-labs-logo.svg" alt="PCL Labs" class="h-6 w-auto md:h-7">
          <p class="font-bold">TiffyCooks</p>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <AuthState v-slot="{ loggedIn: isAuthLoggedIn }">
            <UButton
              v-if="isAuthLoggedIn"
              color="neutral"
              variant="soft"
              label="Go to App"
              to="/dashboard/proposal"
            />
            <UButtonGroup v-else>
              <UButton
                color="neutral"
                variant="soft"
                to="/auth/login"
                label="Login"
              />
              <UDropdownMenu
                :items="authOptions"
                :content="{
                  align: 'end',
                  side: 'bottom',
                  sideOffset: 8,
                }"
                :ui="{
                  content: 'w-full',
                  itemLeadingIcon: 'size-4',
                }"
              >
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-chevron-down"
                  class="border-l border-neutral-200/50 dark:border-white/10"
                />
              </UDropdownMenu>
            </UButtonGroup>
          </AuthState>
          <ThemeToggle />
        </div>
      </WebsiteSection>
    </header>

    <main class="h-screen">
      <UCarousel
        :items="welcomeSections"
        :ui="{
          item: 'snap-center basis-full h-screen w-full flex items-center justify-center',
          container: 'h-full w-full',
        }"
        indicators
        orientation="vertical"
        class="h-full w-full"
      >
        <template #default="{ item }">
          <component :is="item" />
        </template>
      </UCarousel>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import welcome components
import WelcomeHeyTiffy from '~/components/Welcome/HeyTiffy.vue'
import WelcomeTheVision from '~/components/Welcome/TheVision.vue'
import WelcomeTheExperience from '~/components/Welcome/TheExperience.vue'
import WelcomeAlwaysWithYou from '~/components/Welcome/AlwaysWithYou.vue'
import WelcomeThePlan from '~/components/Welcome/ThePlan.vue'
import WelcomeThePartnership from '~/components/Welcome/ThePartnership.vue'
import WelcomeClosing from '~/components/Welcome/Closing.vue'

// Define the welcome sections for the carousel
const welcomeSections = [
  WelcomeHeyTiffy,
  WelcomeTheVision,
  WelcomeTheExperience,
  WelcomeAlwaysWithYou,
  WelcomeThePlan,
  WelcomeThePartnership,
  WelcomeClosing,
]

const authOptions = ref([
  {
    label: 'Login (Email/Password)',
    to: '/auth/login',
    icon: 'i-lucide-key-square',
  },
  {
    label: 'Login with Magic Link',
    to: '/auth/magic-link',
    icon: 'i-lucide-mail',
  },
  {
    label: 'Login with Passkey',
    to: '/auth/login-passkey',
    icon: 'i-lucide-fingerprint',
  },
  {
    label: 'Social Login',
    to: '/auth/social-login',
    icon: 'i-lucide-twitter',
  },
  {
    label: 'Phone Number Login',
    to: '/auth/login-phone',
    icon: 'i-lucide-phone',
  },
  {
    label: 'Register',
    to: '/auth/register',
    icon: 'i-lucide-user-plus',
  },
])
</script>
