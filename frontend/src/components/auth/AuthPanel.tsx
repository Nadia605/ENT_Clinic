'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Stethoscope,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { api } from '@/lib/api';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Lang } from '@/lib/clinic';

export type Role = 'patient' | 'doctor' | 'receptionist' | 'assistant';
export type AuthMode = 'login' | 'register';

const roles: { key: Role; icon: typeof UserRound }[] = [
  { key: 'patient', icon: UserRound },
  { key: 'doctor', icon: Stethoscope },
  { key: 'receptionist', icon: CalendarDays },
  { key: 'assistant', icon: ClipboardList },
];

const copy = {
  en: {
    title: 'Access your portal',
    subtitle: 'Sign in or create a new account to continue.',
    roleLabel: 'I am a',
    roles: { patient: 'Patient', doctor: 'Doctor', receptionist: 'Reception', assistant: 'Assistant' },
    login: 'Sign in',
    register: 'New user',
    fullName: 'Full name',
    fullNamePh: 'e.g. Ahmed Mostafa',
    phone: 'Mobile number',
    email: 'Email',
    password: 'Password',
    confirm: 'Confirm password',
    show: 'Show password',
    hide: 'Hide password',
    submitLogin: 'Sign in',
    submitRegister: 'Create account',
    staffSubtitle: 'Sign in with the account provided by the clinic.',
    staffNote: 'No sign-up needed. Staff accounts are created by Dr. Mohamed Khalil — ask the doctor for your login details.',
    loginSuccessTitle: 'Signed in successfully',
    loginSuccessBody: (name: string) => `Welcome back${name ? `, ${name}` : ''}. You are now signed in to the clinic portal.`,
    registerSuccessTitle: 'Account created successfully',
    registerSuccessBody: 'Your account is ready. You can sign in now with your email and password.',
    registerPendingTitle: 'Registration received',
    registerPendingBody: 'Your account was created successfully and will be activated once the clinic approves it.',
    continueLogin: 'Continue to sign in',
    done: 'Done',
    errors: {
      network: 'Could not reach the clinic server. Please make sure it is running and try again.',
      invalid: 'Incorrect email or password.',
      inactive: 'This account is waiting for clinic approval.',
      wrongRole: 'This account is not registered under the selected role.',
      exists: 'An account with this email already exists. Try signing in instead.',
      mismatch: 'Passwords do not match.',
      short: 'Password must be at least 8 characters.',
      phone: 'Enter a valid Egyptian mobile number (11 digits).',
      generic: 'Something went wrong. Please try again.',
    },
  },
  ar: {
    title: 'الدخول إلى بوابتك',
    subtitle: 'سجّل دخولك أو أنشئ حساباً جديداً للمتابعة.',
    roleLabel: 'أنا',
    roles: { patient: 'مريض', doctor: 'طبيب', receptionist: 'استقبال', assistant: 'مساعد' },
    login: 'تسجيل الدخول',
    register: 'مستخدم جديد',
    fullName: 'الاسم بالكامل',
    fullNamePh: 'مثال: أحمد مصطفى',
    phone: 'رقم الموبايل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirm: 'تأكيد كلمة المرور',
    show: 'إظهار كلمة المرور',
    hide: 'إخفاء كلمة المرور',
    submitLogin: 'تسجيل الدخول',
    submitRegister: 'إنشاء الحساب',
    staffSubtitle: 'سجّل دخولك بالحساب الذي وفرته لك العيادة.',
    staffNote: 'لا تحتاج لإنشاء حساب. حسابات فريق العمل ينشئها دكتور محمد خليل — اطلب بيانات الدخول من الطبيب.',
    loginSuccessTitle: 'تم تسجيل الدخول بنجاح',
    loginSuccessBody: (name: string) => `أهلاً بعودتك${name ? ` يا ${name}` : ''}. تم تسجيل دخولك إلى بوابة العيادة.`,
    registerSuccessTitle: 'تم إنشاء حسابك بنجاح',
    registerSuccessBody: 'حسابك جاهز الآن. يمكنك تسجيل الدخول بالبريد الإلكتروني وكلمة المرور.',
    registerPendingTitle: 'تم استلام طلب التسجيل',
    registerPendingBody: 'تم إنشاء حسابك بنجاح، وسيتم تفعيله بعد موافقة العيادة.',
    continueLogin: 'المتابعة لتسجيل الدخول',
    done: 'تم',
    errors: {
      network: 'تعذّر الاتصال بخادم العيادة. تأكد من تشغيله ثم حاول مرة أخرى.',
      invalid: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      inactive: 'هذا الحساب في انتظار موافقة العيادة.',
      wrongRole: 'هذا الحساب غير مسجّل بالدور الذي اخترته.',
      exists: 'يوجد حساب بهذا البريد الإلكتروني بالفعل. جرّب تسجيل الدخول.',
      mismatch: 'كلمتا المرور غير متطابقتين.',
      short: 'كلمة المرور يجب ألا تقل عن ٨ أحرف.',
      phone: 'أدخل رقم موبايل مصري صحيح (١١ رقماً).',
      generic: 'حدث خطأ ما. حاول مرة أخرى.',
    },
  },
} as const;

type Success = { title: string; body: string; next: 'login' | 'done' };

function describeError(error: unknown, t: (typeof copy)[Lang]) {
  if (!isAxiosError(error)) return t.errors.generic;
  if (!error.response) return t.errors.network;
  const { status } = error.response;
  if (status === 401) return t.errors.invalid;
  if (status === 403) return t.errors.wrongRole;
  if (status === 409) return t.errors.exists;
  if (status === 400) return t.errors.inactive;
  return t.errors.generic;
}

interface AuthPanelProps {
  lang: Lang;
  fixedRole?: Role;
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  id?: string;
}

export default function AuthPanel({ lang, fixedRole, mode: controlledMode, onModeChange, id }: AuthPanelProps) {
  const t = copy[lang];
  const router = useRouter();
  const supabase = createClient();
  const uid = useId();
  const [internalMode, setInternalMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>(fixedRole ?? 'patient');
  const isStaff = role !== 'patient';
  const mode: AuthMode = isStaff ? 'login' : controlledMode ?? internalMode;
  const setMode = (next: AuthMode) => {
    setInternalMode(next);
    onModeChange?.(next);
    setError(null);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Success | null>(null);
  const [email, setEmail] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: String(form.get('email')).trim(),
        password: String(form.get('password')),
      });
      if (authError) throw authError;
      const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', data.user.id).maybeSingle();
      if (profile?.role && profile.role !== role) throw new Error('wrong-role');
      const name = profile?.full_name || '';
      router.push(`/${lang}/${role}/workspace`);
      setSuccess({ title: t.loginSuccessTitle, body: t.loginSuccessBody(name), next: 'done' });
    } catch (err) {
      setError(describeError(err, t));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));
    const phone = String(form.get('phone')).replace(/\s|-/g, '');

    if (!/^01[0125]\d{8}$/.test(phone)) return setError(t.errors.phone);
    if (password.length < 8) return setError(t.errors.short);
    if (password !== String(form.get('confirm'))) return setError(t.errors.mismatch);

    setSubmitting(true);
    setError(null);
    try {
      const registeredEmail = String(form.get('email')).trim();
      const { data, error: authError } = await supabase.auth.signUp({
        email: registeredEmail,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          data: { full_name: String(form.get('fullName')).trim(), phone, role, preferred_language: lang },
        },
      });
      if (authError) throw authError;
      if (data.user) await supabase.from('profiles').upsert({ id: data.user.id, full_name: String(form.get('fullName')).trim(), phone, role, preferred_language: lang });
      setEmail(registeredEmail);
      const pending = !data.session;
      setSuccess({
        title: pending ? t.registerPendingTitle : t.registerSuccessTitle,
        body: pending ? t.registerPendingBody : t.registerSuccessBody,
        next: pending ? 'done' : 'login',
      });
    } catch (err) {
      setError(describeError(err, t));
    } finally {
      setSubmitting(false);
    }
  }

  function closeSuccess() {
    const next = success?.next;
    setSuccess(null);
    if (next === 'login') setMode('login');
  }

  const inputClass =
    'w-full rounded-xl border border-white/12 bg-white/[.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 transition focus:border-cyan-300/60 focus:bg-white/[.07] focus:outline-none focus:ring-2 focus:ring-cyan-300/25';
  const labelClass = 'mb-1.5 block text-xs font-medium text-white/70';

  return (
    <section
      id={id}
      aria-labelledby={`${uid}-title`}
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-white/12 bg-[#0b2029]/90 p-5 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-7"
    >
      <div className="pointer-events-none absolute -top-24 end-0 size-56 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={`${uid}-title`} className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {t.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-white/55">{isStaff ? t.staffSubtitle : t.subtitle}</p>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
            <LockKeyhole className="size-4" aria-hidden="true" />
          </span>
        </div>

        {success ? (
          <div role="status" aria-live="polite" className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-400/[.08] p-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-white">{success.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/65">{success.body}</p>
            <button
              type="button"
              onClick={closeSuccess}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-teal-300 px-5 text-sm font-semibold text-[#04252d] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2029]"
            >
              {success.next === 'login' ? (
                <>
                  <LogIn className="size-4" aria-hidden="true" /> {t.continueLogin}
                </>
              ) : (
                t.done
              )}
            </button>
          </div>
        ) : (
          <>
            <div role="tablist" aria-label={t.title} hidden={isStaff} className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-black/20 p-1 [&[hidden]]:hidden">
              {(['login', 'register'] as const).map((tab) => {
                const Icon = tab === 'login' ? LogIn : UserPlus;
                const active = mode === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    id={`${uid}-tab-${tab}`}
                    aria-selected={active}
                    aria-controls={`${uid}-panel`}
                    onClick={() => setMode(tab)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition',
                      active ? 'bg-gradient-to-r from-cyan-200 to-teal-300 text-[#04252d] shadow-lg shadow-teal-500/15' : 'text-white/60 hover:bg-white/[.05] hover:text-white',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {tab === 'login' ? t.login : t.register}
                  </button>
                );
              })}
            </div>

            {fixedRole ? null : (
              <fieldset className="mt-5">
                <legend className={labelClass}>{t.roleLabel}</legend>
                <div className="grid grid-cols-4 gap-2">
                  {roles.map(({ key, icon: Icon }) => {
                    const active = role === key;
                    return (
                      <label
                        key={key}
                        className={cn(
                          'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-2.5 text-[11px] font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-300/50',
                          active ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[.03] text-white/55 hover:border-white/20 hover:text-white',
                        )}
                      >
                        <input
                          type="radio"
                          name={`${uid}-role`}
                          value={key}
                          checked={active}
                          onChange={() => setRole(key)}
                          className="sr-only"
                        />
                        <Icon className="size-4" aria-hidden="true" />
                        {t.roles[key]}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${mode}`} className="mt-5">
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4" noValidate={false}>
                  <div>
                    <label htmlFor={`${uid}-email`} className={labelClass}>{t.email}</label>
                    <input
                      id={`${uid}-email`}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      dir="ltr"
                      defaultValue={email}
                      key={email}
                      className={inputClass}
                      placeholder="name@example.com"
                    />
                  </div>
                  <PasswordField
                    id={`${uid}-password`}
                    name="password"
                    label={t.password}
                    autoComplete="current-password"
                    show={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    toggleLabel={showPassword ? t.hide : t.show}
                    inputClass={inputClass}
                    labelClass={labelClass}
                  />
                  {isStaff ? <p className="rounded-xl border border-cyan-300/20 bg-cyan-300/[.06] px-3 py-2 text-xs leading-5 text-cyan-100/90">{t.staffNote}</p> : null}
                  <ErrorMessage message={error} />
                  <SubmitButton submitting={submitting} label={t.submitLogin} icon={LogIn} />
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor={`${uid}-name`} className={labelClass}>{t.fullName}</label>
                    <input id={`${uid}-name`} name="fullName" required minLength={3} autoComplete="name" className={inputClass} placeholder={t.fullNamePh} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-phone`} className={labelClass}>{t.phone}</label>
                      <input id={`${uid}-phone`} name="phone" type="tel" required inputMode="tel" autoComplete="tel" dir="ltr" className={inputClass} placeholder="01xxxxxxxxx" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-remail`} className={labelClass}>{t.email}</label>
                      <input id={`${uid}-remail`} name="email" type="email" required autoComplete="email" dir="ltr" className={inputClass} placeholder="name@example.com" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <PasswordField
                      id={`${uid}-rpassword`}
                      name="password"
                      label={t.password}
                      autoComplete="new-password"
                      show={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                      toggleLabel={showPassword ? t.hide : t.show}
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                    <PasswordField
                      id={`${uid}-confirm`}
                      name="confirm"
                      label={t.confirm}
                      autoComplete="new-password"
                      show={showPassword}
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                  </div>
                  <ErrorMessage message={error} />
                  <SubmitButton submitting={submitting} label={t.submitRegister} icon={UserPlus} />
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function PasswordField({
  id,
  name,
  label,
  autoComplete,
  show,
  onToggle,
  toggleLabel,
  inputClass,
  labelClass,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  show: boolean;
  onToggle?: () => void;
  toggleLabel?: string;
  inputClass: string;
  labelClass: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          dir="ltr"
          className={cn(inputClass, onToggle && 'pe-11')}
          placeholder="••••••••"
        />
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={toggleLabel}
            className="absolute inset-y-0 end-0 grid w-11 place-items-center text-white/45 hover:text-white"
          >
            {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-300/25 bg-rose-400/[.08] px-3 py-2.5 text-xs leading-5 text-rose-100">
      <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-300" aria-hidden="true" />
      {message}
    </p>
  );
}

function SubmitButton({ submitting, label, icon: Icon }: { submitting: boolean; label: string; icon: typeof LogIn }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-teal-300 text-sm font-semibold text-[#04252d] shadow-lg shadow-teal-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2029]"
    >
      {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Icon className="size-4" aria-hidden="true" />}
      {label}
    </button>
  );
}
