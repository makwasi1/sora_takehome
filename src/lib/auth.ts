import { createClient } from "@/utils/supabase/client";
export const getUserId = async () => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  return session.user.id;
};
