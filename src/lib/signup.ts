type SignupClient = {
  signUp: (input: { email: string; password: string; options: { emailRedirectTo: string } }) => Promise<{
    data: { session: unknown | null };
    error: { code?: string | undefined; message: string } | null;
  }>;
};

export async function registerAccount(client: SignupClient, email: string, password: string, origin: string) {
  const { data, error } = await client.signUp({
    email: email.trim(),
    password,
    options: { emailRedirectTo: origin },
  });
  if (error) {
    const messages: Record<string, string> = {
      user_already_exists: "Este e-mail já possui uma conta. Volte para entrar.",
      weak_password: "Escolha uma senha mais segura.",
      over_email_send_rate_limit: "O limite de envio de e-mails foi atingido. Tente novamente mais tarde.",
      signup_disabled: "O cadastro está indisponível no momento.",
      email_address_invalid: "Confira o endereço de e-mail informado.",
    };
    throw new Error(messages[error.code ?? ""] ?? "Não foi possível criar a conta. Confira os dados e tente novamente.");
  }
  return data.session ? "signed-in" : "confirm-email";
}