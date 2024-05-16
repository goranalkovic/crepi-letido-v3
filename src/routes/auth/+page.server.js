// @ts-nocheck
import { redirect } from '@sveltejs/kit'

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get('email')

		const { error } = await supabase.auth.signInWithOtp({
			email: email,
			options: {
				// set this to false if you do not want the user to be automatically signed up
				shouldCreateUser: true,
				emailRedirectTo: '/check-email',
			},
		});

		if (error) {
			console.error(error)
			return redirect(303, '/auth/error')
		} else {
			return redirect(303, '/check-email')
		}
	},
}