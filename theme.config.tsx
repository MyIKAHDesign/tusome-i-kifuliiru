import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: <span>Tusome i Kifuliiru</span>,
  project: {
    link: 'https://github.com/MyIKAHDesign/tusome-i-kifuliiru',
  },
  chat: {
    link: 'https://twitter.com/ibufuliiru',
    icon: <svg width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="m231.9 169.8l-94.8 65.6a15.7 15.7 0 0 1-18.2 0l-94.8-65.6a16.1 16.1 0 0 1-6.4-17.3L45 50a12 12 0 0 1 22.9-1.1L88.5 104h79l20.6-55.1A12 12 0 0 1 211 50l27.3 102.5a16.1 16.1 0 0 1-6.4 17.3Z"></path></svg>,
  
  },
  docsRepositoryBase: 'https://github.com/MyIKAHDesign/tusome-i-kifuliiru',
  // footer: {
  //   text: 'Tusome i Kifuliiru',
  // },
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
      MIT {new Date().getFullYear()} © <a href="https://kifuliiru.vercel.app/" target="_blank">Tumenye Ibufuliiru</a>. Guno mukolwa guliri hano higulu tumenye bingi ku Kifuliiru.
    </span>,
  },
  search:{
    placeholder: "Looza hano...",
    // emptyResult: "Ndabyo twaloonga",
    // loading: "Tugweeti tugalooza",
    // error:"Hali ibyagendeka buligo",

  },
}

export default config
