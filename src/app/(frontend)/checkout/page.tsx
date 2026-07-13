import { getPayload } from 'payload'
import config from '@/payload.config'
import CheckoutForm from '@/components/CheckoutForm'
import CartGuard from '@/components/CartGuard'

export default async function CheckoutPage() {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'store-settings' })

  const bankDetails = {
    bankName: settings.bankName ?? '',
    bankHolder: settings.bankHolder ?? '',
    bankClabe: settings.bankClabe ?? '',
    bankAccount: settings.bankAccount ?? '',
    transferNotes: settings.transferNotes ?? '',
  }

  return (
    <>
      <CartGuard />
      <CheckoutForm
        bankDetails={bankDetails}
        expressShippingCost={settings.expressShippingCost ?? 0}
        expressShippingDays={settings.expressShippingDays ?? '1–2 días hábiles'}
      />
    </>
  )
}
