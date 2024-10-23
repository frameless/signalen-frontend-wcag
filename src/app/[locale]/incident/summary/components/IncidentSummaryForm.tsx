'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { Divider } from '@/components/ui/Divider'
import { LinkWrapper } from '@/components/ui/LinkWrapper'
import { useStepperStore } from '@/store/stepper_store'
import React from 'react'
import { LocationMap } from '@/components/ui/LocationMap'
import { signalsClient } from '@/services/client/api-client'
import { useRouter } from '@/routing/navigation'
import { useFormStore } from '@/store/form_store'
import { _NestedLocationModel } from '@/services/client'

const IncidentSummaryForm = () => {
  const t = useTranslations('describe-summary')
  const { formState } = useFormStore()
  const { goToStep } = useStepperStore()
  const router = useRouter()

  /**
   * We decided to use `@ts-ignore` here because our client is generated by typescript-openapi-gen.
   * The `v1PublicSignalsCreate` method expects a large number of fields according to the TypeScript
   * definition, but many of these fields are not actually required for the API call to succeed.
   *
   * By using `@ts-ignore`, we can bypass TypeScript's type-checking errors for this case, while still
   * allowing the API call to function correctly. This prevents unnecessary complexity in aligning the
   * generated types with the real API requirements.
   */
  const handleSignalSubmit = async () => {
    await signalsClient.v1
      .v1PublicSignalsCreate({
        text: formState.description,
        // @ts-ignore
        location: {
          geometrie: {
            type: _NestedLocationModel.type.POINT,
            coordinates: formState.coordinates,
          },
        },
        // @ts-ignore
        category: {
          sub_category:
            process.env.NEXT_PUBLIC_BASE_URL_API +
            `/signals/v1/public/terms/categories/${formState.main_category}/sub_categories/${formState.sub_category}/`,
        },
        /* TODO: check if allows_contact needs to be set */
        reporter: {
          email: formState.email,
          phone: formState.phone,
          sharing_allowed: formState.sharing_allowed,
          allows_contact: false,
        },
        incident_date_start: new Date().toISOString(),
      })
      .then((res) => router.push('/incident/thankyou'))
      .catch((err) => console.log(err))
  }

  return (
    <div className="flex flex-col gap-8">
      <p>{t('description')}</p>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 md:flex-row justify-between">
          <h3>{t('steps.step_one.title')}</h3>
          <LinkWrapper href={'/incident'} onClick={() => goToStep(1)}>
            {t('steps.step_one.edit')}
          </LinkWrapper>
        </div>
        <IncidentSummaryFormItem
          title={t('steps.step_one.input_heading')}
          value={formState.description}
        />
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 md:flex-row justify-between">
          <h3>{t('steps.step_two.title')}</h3>
          <LinkWrapper href={'/incident/add'} onClick={() => goToStep(2)}>
            {t('steps.step_two.edit')}
          </LinkWrapper>
        </div>
        <IncidentSummaryFormItem title={t('steps.step_two.input_heading')}>
          <LocationMap />
        </IncidentSummaryFormItem>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 md:flex-row justify-between">
          <h3>{t('steps.step_three.title')}</h3>
          <LinkWrapper href={'/incident/contact'} onClick={() => goToStep(3)}>
            {t('steps.step_three.edit')}
          </LinkWrapper>
        </div>
        {formState.phone === undefined &&
        formState.email === undefined &&
        formState.sharing_allowed === false ? (
          <p>{t('steps.step_three.no_contact_details')}</p>
        ) : (
          <>
            {formState.phone !== undefined && formState.phone !== null ? (
              <IncidentSummaryFormItem
                title={t('steps.step_three.input_telephone_heading')}
                value={formState.phone}
              />
            ) : null}
            {formState.email !== undefined && formState.email !== null ? (
              <IncidentSummaryFormItem
                title={t('steps.step_three.input_mail_heading')}
                value={formState.email}
              />
            ) : null}
            {formState.sharing_allowed ? (
              <IncidentSummaryFormItem
                title={t('steps.step_three.input_sharing_heading')}
                value={t('steps.step_three.input_sharing_allowed')}
              />
            ) : null}
          </>
        )}
      </div>
      <IncidentFormFooter handleSignalSubmit={handleSignalSubmit} />
    </div>
  )
}

export const IncidentSummaryFormItem = ({
  title,
  value = '',
  children,
}: {
  title: string
  value?: string
  children?: React.ReactElement
}) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold">{title}</p>
      {value !== '' ? <p>{value}</p> : <div className="mt-2">{children}</div>}
    </div>
  )
}

export { IncidentSummaryForm }
