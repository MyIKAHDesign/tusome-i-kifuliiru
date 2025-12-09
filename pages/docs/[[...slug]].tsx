import { GetServerSideProps } from 'next';

// Redirect old /docs/* URLs to new structure without /docs/
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};
  const slugArray = Array.isArray(slug) ? slug : [slug];
  const newPath = slugArray && slugArray.length > 0 
    ? `/${slugArray.join('/')}` 
    : '/';
  
  return {
    redirect: {
      destination: newPath,
      permanent: true, // 301 redirect
    },
  };
};

// This component will never render due to the redirect
export default function DocsRedirect() {
  return null;
}
