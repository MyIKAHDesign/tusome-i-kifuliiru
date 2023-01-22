import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Tusome i Kifuliiru</span>,
  project: {
    link: 'https://github.com/MyIKAHDesign/tusome-i-kifuliiru',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/MyIKAHDesign/tusome-i-kifuliiru',
  footer: {
    text: 'Tusome i Kifuliiru',
  },
  useNextSeoProps() {
    const { route } = useRouter()
    if (route !== '/') {
      return {
        titleTemplate: '%s – Tusome i KIfuliiru'
      }
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Tusome i Kifuliiru. Kifuliiru ndeto yitu" />
      <meta property="og:description" content="Tusome indeto yitu Kifuliiru mu Kifuliiru. Kifuliiru ndeto yitu, ndeto ngale." />
    </>
  ),
  banner: {
    key: '2.0-release',
    text: <a href="https://kifuliiru.vercel.app/" target="_blank">
      🎉 Tusome i Kifuliiru 2.0. Wangakoli yaandika naho kifuliiru.vercel.comm.  Lenga hano →
    </a>,
  },
  footer: {
    text: <span>
      MIT {new Date().getFullYear()} © <a href="https://kifuliiru.vercel.app/" target="_blank">Tusome i KIfuliiru</a>.
    </span>,
  },
  search:{
    placeholder: "Looza hano...",
  },
}

export default config
