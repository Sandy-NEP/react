import React from 'react'

const TermsAndConditions = () => {
  return (
    <section className='py-4 px-2 max-md:py-1 flex flex-col gap-6 max-lg:gap-5 max-md:gap-4'>
      <h1 className='text1 font-bold text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-1xl'>Terms and Conditions</h1>
      <aside className='flex flex-col gap-4 max-md:gap-3'>
        <div className='flex flex-col gap-3 max-md:gap-2'>
          <h3 className='text-2 font-semibold text-2xl max-lg:text-[22px] max-md:text-[18px] max-sm:text-[16px]'>User Agreement</h3>
          <p className='text3 text-[14px] max-md:text-[12px] max-sm:text-[10px] text-justify'>This User Agreement ("Agreement") is a legally binding contract between you ("User" or "you") and Carson eCommerce Inc. ("Storetasker," "we," "our," or "us"). By accessing or using our website (www.storetasker.com), any affiliated websites, mobile applications, or services (collectively, the "Site"), or any products, applications, or services offered through the Site (the "Services"), you agree to comply with and be bound by all terms and conditions outlined in this Agreement.</p>
        </div>
        <div className='flex flex-col gap-3 max-md:gap-2 relative'>
          <h3 className='text-2 font-semibold text-2xl max-lg:text-[22px] max-md:text-[18px] max-sm:text-[16px]'>Incorporated Terms</h3>
          <p className='list-disc text3 text-[14px] max-md:text-[10px] relative'>This Agreement incorporates by reference the following additional policies and guidelines:</p>
          <ul className='flex flex-col gap-1 pl-10 max-md:pl-5 mb10'>
            <li className='list-disc text3 text-[13px] max-md:text-[10px] max-sm:text-[9px]'>Privacy Policy</li>
            <li className='list-disc text3 text-[13px] max-md:text-[10px] max-sm:text-[9px]'>Vetting Guidelines</li>
            <li className='list-disc text3 text-[13px] max-md:text-[10px] max-sm:text-[9px]'>Project Contracts</li>
          </ul>
          <p className='list-disc text3 text-[14px] max-md:text-[10px] relative'>(Collectively, along with this Agreement, the "Terms of Service"). These Terms of Service govern your use of Storetasker's Services and are available at Storetasker.com. Storetasker reserves the right, at its sole discretion, to modify, amend, or update this Agreement and the Terms of Service at any time. Changes will be posted on the Site and may take effect immediately or with reasonable prior notice, as determined by Storetasker.</p>
        </div>
      </aside>
    </section>
  )
}

export default TermsAndConditions;
