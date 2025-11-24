import React from 'react'
import { assets } from '../assets/assets'
import appStore from '../assets/appStore.svg';

const Footer = () => {
  return (
      <footer class="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 mt-40  w-full text-gray-500">
    <div class="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-14">
        <div class="md:max-w-96">
            <img className='w-36 h-auto' alt='logo'/>
            <p class="mt-6 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>

            <div className='flex items-center gap-2 mt-4'>
              <img src="" alt='google play' className='h-9 w-auto '/>
              <img/>
              <img src={appStore} alt='app store' className='h-9 w-auto '/>
              <img/>
            </div>

        </div>
        <div class="flex-1 flex items-start md:justify-end gap-20">
            <div>
                <h2 class="font-semibold mb-5 text-gray-800">Company</h2>
                <ul class="text-sm space-y-2">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Privacy policy</a></li>
                </ul>
            </div>
            <div>
                <h2 class="font-semibold mb-5 text-gray-800">Get in touch</h2>
                <div class="text-sm space-y-2">
                    <p>+1-212-456-7890</p>
                    <p>contact@example.com</p>
                </div>
            </div>
        </div>
    </div>
    <p class="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2024 © <a href="https://prebuiltui.com">QuickShow</a>. All Right Reserved.
    </p>
</footer>

  )
}

export default Footer