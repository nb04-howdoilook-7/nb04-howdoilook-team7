export interface Signup {
  email: string;
  password: string;
  nickname: string;
}

export interface ConfirmEmail {
  email: string;
  code: string;
}

export interface Login {
  email: string;
  password: string;
}
