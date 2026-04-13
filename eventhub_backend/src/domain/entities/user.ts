export interface OTPSettings {
  secret: string;
  enabled: boolean;
}

export interface UserProps {
  id: string;
  email: string;
  password: string;
  role: string;
  otpSecret?: string | null;
  otpEnable: number;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get otpSettings(): OTPSettings | null {
    if (!this.props.otpSecret) {
      return null;
    }
    return {
      secret: this.props.otpSecret,
      enabled: this.props.otpEnable === 1,
    };
  }
}
