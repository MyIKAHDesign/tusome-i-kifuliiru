import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  //   logo: (<img src="kifuliiru.png"> <span>Tusome i Kifuliiru</span> ,

  //   <style jsx>{`
  //     img {
  //       mask-image: linear-gradient(
  //         60deg,
  //         black 25%,
  //         rgba(0, 0, 0, 0.2) 50%,
  //         black 75%
  //       );
  //       mask-size: 400%;
  //       mask-position: 0%;
  //     }
  //     img:hover {
  //       mask-position: 100%;
  //       transition:
  //         mask-position 1s ease,
  //         -webkit-mask-position 1s ease;
  //     }
  //   `}</style>

  // </img>
  //   ),

  logo: <span>Tusome i Kifuliiru</span>,

  //Remove GitHub link and icon on website. To display it, uncomment these lines below.

  // project: {
  //   link: "https://github.com/MyIKAHDesign/tusome-i-kifuliiru",
  // },

  // docsRepositoryBase: "https://github.com/MyIKAHDesign/tusome-i-kifuliiru",
  // footer: {
  //   text: 'Tusome i Kifuliiru',
  // },
  useNextSeoProps() {
    const { route } = useRouter();
    if (route !== "/") {
      return {
        titleTemplate: "%s – Tusome i Kifuliiru",
      };
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta
        property="og:title"
        content="Kifuliiru | Tusome i Kifuliiru mu Kifuliiru"
      />
      <meta
        property="og:description"
        content="Kifuliiru. Kifuliiru language. Kifuliiru language online documentation. Kifuliiru Academy. Tusome indeto yitu Kifuliiru mu Kifuliiru. Kifuliiru ndeto yitu, ndeto ngale. Learn the Kifuliiru language in Kifuliiru.
      This website is here to learn the Kifuliiru language and to promote it. The Kifuliiru language is a language spoken in DRCongo, the Congo-Kinshasa; in the Eastern part, in Uvira territory, South Kivu province. 
      You may have been asking yourself about what this language is? How can I learn it? Here is a platform for the Kifuliiru language for learners or students and teachers as well."
      />
      <meta property="og:image" content=".github/DRCongo.png" />
      <link rel="icon" href=".github/kifuliiru.png" type="image/png" />
    </>
  ),
  banner: {
    key: "2.0-release",
    text: (
      <a href="https://ibufuliiru.editorx.io/kifuliiru" target="_blank">
        🎉 Zatira namuyehuulo we' Kifuliiru. Lenga hano →
      </a>
    ),
  },
  footer: {
    text: (
      <div>
        <span>
          Tusome i Kifuliiru {new Date().getFullYear()} ©{" "}
          <a href="https://kifuliiru.net/"> Tumenye Ibufuliiru </a>
        </span>

        <span>
          <a href="https://ayivugwekabemba.me" target="_blank">
            By Ayivugwe Kabemba Mukome
          </a>
        </span>
      </div>
    ),
  },
  search: {
    placeholder: "Looza hano...",
    // emptyResult: "Ndabyo twaloonga",
    // loading: "Tugweeti tugalooza",
    // error: "Hali ibitagendeka bwija",
  },
  sidebar: {
    // toggleButton: true,
  },
};

export default config;
