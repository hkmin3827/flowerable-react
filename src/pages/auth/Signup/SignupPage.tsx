import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignupUser, useSignupShop } from "@/features/auth/hooks";
import { UserSignupRequest, ShopSignupRequest } from "@/features/auth/types";
import RegionSelector from "@/selector/RegionSelector";
import {
  Container,
  TypeSelector,
  TypeButton,
  Form,
  Title,
  InputGroup,
  Label,
  Input,
  ErrorText,
  SubmitButton,
} from "./SignupPage.styles";

export const SignupPage = () => {
  const [accountType, setAccountType] = useState<"USER" | "SHOP">("USER");

  return (
    <Container>
      <TypeSelector>
        <TypeButton
          $active={accountType === "USER"}
          onClick={() => setAccountType("USER")}
        >
          일반 회원
        </TypeButton>
        <TypeButton
          $active={accountType === "SHOP"}
          onClick={() => setAccountType("SHOP")}
        >
          샵 회원
        </TypeButton>
      </TypeSelector>

      {accountType === "USER" ? <UserSignupForm /> : <ShopSignupForm />}
    </Container>
  );
};

const UserSignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignupRequest>();
  const { mutate: signup, isPending } = useSignupUser();

  const onSubmit = (data: UserSignupRequest) => {
    signup(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Title>일반 회원가입</Title>

      <InputGroup>
        <Label>이메일</Label>
        <Input
          type="email"
          {...register("email", { required: "이메일을 입력해주세요" })}
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            minLength: { value: 8, message: "8자 이상 입력해주세요" },
          })}
        />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>이름</Label>
        <Input {...register("name", { required: "이름을 입력해주세요" })} />
        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>전화번호</Label>
        <Input
          {...register("telnum", { required: "전화번호를 입력해주세요" })}
          placeholder="010-0000-0000"
        />
        {errors.telnum && <ErrorText>{errors.telnum.message}</ErrorText>}
      </InputGroup>

      <SubmitButton type="submit" disabled={isPending}>
        {isPending ? "가입 중..." : "회원가입"}
      </SubmitButton>
    </Form>
  );
};

const ShopSignupForm = () => {
  const methods = useForm<ShopSignupRequest>();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const { mutate: signup, isPending } = useSignupShop();

  const onSubmit = (data: ShopSignupRequest) => {
    signup(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Title>샵 회원가입</Title>

      <InputGroup>
        <Label>이메일</Label>
        <Input type="email" {...register("email", { required: true })} />
        {errors.email && <ErrorText>이메일을 입력해주세요</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          {...register("password", { required: true, minLength: 8 })}
        />
        {errors.password && (
          <ErrorText>비밀번호는 8자 이상이어야 합니다</ErrorText>
        )}
      </InputGroup>

      <InputGroup>
        <Label>연락처</Label>
        <Input
          {...register("telnum", { required: true })}
          placeholder="010-0000-0000"
        />
        {errors.telnum && <ErrorText>전화번호를 입력해주세요</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>샵 이름</Label>
        <Input {...register("shopName", { required: true })} />
        {errors.shopName && <ErrorText>샵 이름을 입력해주세요</ErrorText>}
      </InputGroup>

      <RegionSelector
        control={control}
        errors={errors}
        setValue={setValue}
        regionCode="regionCode"
        districtCode="districtCode"
      />

      <InputGroup>
        <Label>상세 주소</Label>
        <Input {...register("address", { required: true })} />
        {errors.address && <ErrorText>주소를 입력해주세요</ErrorText>}
      </InputGroup>

      <SubmitButton type="submit" disabled={isPending}>
        {isPending ? "가입 중..." : "샵 회원가입"}
      </SubmitButton>
    </Form>
  );
};
