'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, LogOut, Plus, ShieldCheck, Stethoscope } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function WorkspacePage() {
  const params = useParams<{ locale: string; role: string }>()
  const router = useRouter()
  const isArabic = params.locale === 'ar'
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [documents, setDocuments] = useState<{ id: string; file_name: string; reference_notes: string | null; created_at: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return router.replace(`/${params.locale}/${params.role}`)
      setUser(data.user)
      const { data: files } = await supabase.from('patient_documents').select('id, file_name, reference_notes, created_at').eq('patient_id', data.user.id).order('created_at', { ascending: false })
      setDocuments(files ?? [])
    }
    load()
  }, [params.locale, params.role, router, supabase])

  async function uploadDocument(file: File) {
    if (!user) return
    setUploading(true)
    const path = `${user.id}/${crypto.randomUUID()}-${file.name}`
    const { error } = await supabase.storage.from('patient-documents').upload(path, file, { contentType: file.type, upsert: false })
    if (!error) {
      await supabase.from('patient_documents').insert({ patient_id: user.id, uploaded_by: user.id, file_name: file.name, file_path: path, mime_type: file.type, reference_notes: isArabic ? 'مستند مرفوع من المريض' : 'Patient-uploaded reference document' })
      const { data: files } = await supabase.from('patient_documents').select('id, file_name, reference_notes, created_at').eq('patient_id', user.id).order('created_at', { ascending: false })
      setDocuments(files ?? [])
    }
    setUploading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.replace(`/${params.locale}`)
  }

  return <main dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-abyss px-5 py-6 text-cream sm:px-10">
    <div className="mx-auto max-w-6xl">
      <header className="flex items-center justify-between border-b border-cream/10 pb-5">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><Stethoscope aria-hidden="true" /></span><div><p className="text-xs uppercase tracking-[0.2em] text-cream/45">AuraENT</p><h1 className="text-lg font-semibold">{isArabic ? 'بوابة المريض' : 'Patient portal'}</h1></div></div>
        <button onClick={signOut} className="flex items-center gap-2 rounded-xl border border-cream/10 px-3 py-2 text-sm text-cream/65 hover:text-cream"><LogOut aria-hidden="true" />{isArabic ? 'خروج' : 'Sign out'}</button>
      </header>
      <section className="grid gap-5 py-8 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-3xl border border-cyan-200/15 bg-[#0b2029]/80 p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-cyan-200">{isArabic ? 'السجل الطبي الرقمي' : 'Digital patient history'}</p><h2 className="mt-2 text-3xl font-semibold">{isArabic ? 'خلّي فريق الرعاية يشوف الصورة كاملة.' : 'Give your care team the full picture.'}</h2><p className="mt-3 max-w-xl leading-7 text-cream/60">{isArabic ? 'أضف الأعراض والحساسيات والمستندات الطبية قبل الزيارة لتقليل الكتابة وتسهيل الكشف.' : 'Add symptoms, allergies, and medical references before your visit to reduce paperwork and make the consultation more focused.'}</p></div><ShieldCheck className="text-cyan-200" aria-hidden="true" /></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2"><button className="flex items-center justify-between rounded-2xl border border-cream/10 bg-white/[.04] p-4 text-start hover:bg-white/[.07]"><span><strong className="block">{isArabic ? 'تاريخي المرضي' : 'My medical history'}</strong><small className="text-cream/45">{isArabic ? 'الحساسيات والحالات المزمنة' : 'Allergies and chronic conditions'}</small></span><Plus aria-hidden="true" /></button><label className="flex cursor-pointer items-center justify-between rounded-2xl border border-cyan-200/20 bg-cyan-300/[.06] p-4 text-start hover:bg-cyan-300/10"><span><strong className="block">{isArabic ? 'ارفع أشعة أو تقرير' : 'Upload a scan or report'}</strong><small className="text-cream/45">PDF, JPG, PNG</small></span><FileText aria-hidden="true" /><input className="sr-only" type="file" accept="application/pdf,image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && uploadDocument(e.target.files[0])} /></label></div>
        </div>
        <aside className="rounded-3xl border border-cream/10 bg-white/[.03] p-6"><h2 className="text-lg font-semibold">{isArabic ? 'مستنداتي' : 'My references'}</h2><p className="mt-1 text-sm text-cream/50">{documents.length} {isArabic ? 'مستند محفوظ' : 'secure documents'}</p><div className="mt-5 flex flex-col gap-3">{documents.length ? documents.map((doc) => <div key={doc.id} className="rounded-2xl border border-cream/10 p-3"><p className="truncate text-sm font-medium">{doc.file_name}</p><p className="mt-1 text-xs text-cream/45">{new Date(doc.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}</p></div>) : <p className="rounded-2xl border border-dashed border-cream/15 p-5 text-sm leading-6 text-cream/45">{isArabic ? 'لسه مفيش مستندات. ارفع أول تقرير أو أشعة من هنا.' : 'No references yet. Upload your first report or scan here.'}</p>}</div></aside>
      </section>
    </div>
  </main>
}
