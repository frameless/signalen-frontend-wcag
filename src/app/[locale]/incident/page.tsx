import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import {
  Heading1,
  Paragraph,
  Alert,
  Link,
} from '@utrecht/component-library-react/dist/css-module'
import '@utrecht/design-tokens/dist/index.css'

export default async function Home() {
  return <IncidentDescriptionPage />
}

function IncidentDescriptionPage() {
  const t = useTranslations('describe-report')
  const messages = useMessages()

  return (
    <>
      <div className="flex flex-col gap-4">
        <Heading1>{t('heading')}</Heading1>
        <Alert>
          <div className="utrecht-alert__message" role="alert">
            <Paragraph>
              Lukt het niet om een melding te doen? Bel het telefoonnummer
              <Link href="tel:14 020"> 14 020.</Link>
            </Paragraph>
            <Paragraph>
              Wij zijn bereikbaar van maandag tot en met vrijdag van 08:00 tot
              18:00 uur.
            </Paragraph>
          </div>
        </Alert>

        <NextIntlClientProvider messages={messages}>
          <IncidentDescriptionForm />
        </NextIntlClientProvider>
      </div>
    </>
  )
}
