// @ts-ignore
export const load = async ({ locals: { supabase, user } }) => {
	const { data: userData } = await supabase.from('users').select().eq('email', user?.email).maybeSingle();

	return { userData };
}