import { Auth } from '@supabase/auth-ui-react'
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import supabase from '../config/supabaseClient.config'

const SignIn = () => {

  return (
    <div className='w-96 justify-center items-center'>
        <Auth
            supabaseClient={supabase}
            appearance={{ 
                theme: ThemeSupa, 
                extend: true,
                className: {
                    button: "flex gap-2 justify-center items-center bg-neutral px-2 py-2 text-white rounded-md"
                }
            }}
            providers={['google']}
        />
    </div>
  )
}

export default SignIn