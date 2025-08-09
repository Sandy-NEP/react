import React from 'react'

const PrivacyPolicy = () => {
  return (
    <section className='px-2 py-4 max-md:py-1 flex flex-col gap-6 max-lg:gap-5 max-md:gap-4'>
      <h1 className='text1 font-bold text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-1xl'>Privacy Policy</h1>
      <aside className='flex flex-col gap-4 max-md:gap-3'>
        <div className='flex flex-col gap-3 max-md:gap-2'>
          <h3 className='text-2 font-semibold text-2xl max-lg:text-[22px] max-md:text-[18px] max-sm:text-[16px]'>General Data Protection Regulation (GDPR) Update</h3>
          <p className='text3 text-[14px] max-md:text-[12px] max-sm:text-[10px] text-justify'>Effective April 11, 2025</p>
          <p className='text3 text-[14px] max-md:text-[12px] max-sm:text-[10px] text-justify'>As storetasker, we understand the important of privacy and above all, data protection.</p>
          <p className='text3 text-[14px] max-md:text-[12px] max-sm:text-[10px] text-justify'>Fro your peace of mind while using our service, we have updated our Privacy Policy in an effort to remain transparent about the way we collect and use your information.</p>
        </div>
        <div className='flex flex-col gap-3 max-md:gap-2 relative'>
          <h3 className='text-2 font-semibold text-2xl max-lg:text-[22px] max-md:text-[18px] max-sm:text-[16px]'>Incorporated Terms</h3>
          <ul className='flex flex-col gap-1 pl-10 max-md:pl-5'>
            <li className='list-disc text3 text-[14px] max-md:text-[12px] max-sm:text-[9px]'>Communicate with you</li>
            <li className='list-disc text3 text-[14px] max-md:text-[12px] max-sm:text-[9px]'>Provide you with service</li>
            <li className='list-disc text3 text-[14px] max-md:text-[12px] max-sm:text-[9px]'>Understand and improve our product</li>
            <li className='list-disc text3 text-[14px] max-md:text-[12px] max-sm:text-[9px]'>Send you promotional emails</li>
            <li className='list-disc text3 text-[14px] max-md:text-[12px] max-sm:text-[9px]'>Target you with promotional messages online</li>
          </ul>
        </div>
        <div className='flex flex-col gap-3 max-md:gap-2'>
          <h3 className='text-2 font-semibold text-2xl max-lg:text-[22px] max-md:text-[18px] max-sm:text-[16px]'>Information Provided Voluntarily</h3>
          <p className='text3 text-[14px] max-md:text-[12px] max-sm:text-[10px] text-justify'>If you are a Storetasker customer, we collect the information you provide us with voluntarily, throughout the account creation process, as well form the project request you are publishing on you platform.</p>
        </div>
      </aside>
    </section>
  )
}

export default PrivacyPolicy
