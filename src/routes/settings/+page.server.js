// @ts-nocheck
import { redirect } from '@sveltejs/kit'

export const actions = {
	update: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const avatar = formData.get('avatar');
		const firstName = formData.get('first-name');
		const lastName = formData.get('last-name');
		const themeColor = formData.get('theme-color');
		const themeMode = formData.get('theme-mode');

		const { error } = await supabase.from('users').update({
			avatar,
			firstName,
			lastName,
			options: {
				...user.options,
				themeColor: themeColor ?? 'default',
				themeMode: themeMode ?? 'system',
			},
		}).eq('email', user.email);

		if (error) {
			console.error(error);
		}

		return redirect(303, '/');
	},
}