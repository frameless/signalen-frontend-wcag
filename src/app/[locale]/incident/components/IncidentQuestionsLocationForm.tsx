'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import { Textarea } from '@/components/ui/TextArea'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useSignalStore, useStepperStore } from '@/store/store'
import { useRouter } from '@/routing/navigation'

const IncidentQuestionsLocationForm = () => {
  const t = useTranslations('describe-add.form')
  const { updateSignal, signal } = useSignalStore()
  const { addOneStep } = useStepperStore()
  const router = useRouter()

  const incidentDescriptionFormSchema = z.object({
    map: z.any(),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      map: null,
    },
  })

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    console.log(values)

    updateSignal({
      ...signal,
      location: { ...signal.location, address: { naam: 'oranjestraat' } },
      reporter: { ...signal.reporter, allows_contact: true },
    })

    addOneStep()

    router.push('/incident/contact')
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 items-start"
        >
          <FormField
            name={'map'}
            control={form.control}
            render={({ field, formState: { errors } }) => (
              <FormItem>
                <div>
                  <FormLabel>{t('add_map_heading')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl></FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <IncidentFormFooter />
    </div>
  )
}

export { IncidentQuestionsLocationForm }
