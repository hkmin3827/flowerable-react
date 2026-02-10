import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useSignupUser, useSignupShop } from "@/features/auth/hooks";
import { UserSignupRequest, ShopSignupRequest } from "@/features/auth/types";
import RegionSelector from "@/selector/RegionSelector";

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

      {/* <InputGroup>
        <Label>담당자 이름</Label>
        <Input {...register("name", { required: true })} />
        {errors.name && <ErrorText>이름을 입력해주세요</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>사업자등록번호</Label>
        <Input
          {...register("businessNumber", { required: true })}
          placeholder="000-00-00000"
        />
        {errors.businessNumber && (
          <ErrorText>사업자등록번호를 입력해주세요</ErrorText>
        )}
      </InputGroup> */}

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

// Styled Components
const Container = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
`;

const TypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TypeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid ${({ $active }) => ($active ? "#3b82f6" : "#d1d5db")};
  background-color: ${({ $active }) => ($active ? "#eff6ff" : "white")};
  color: ${({ $active }) => ($active ? "#3b82f6" : "#6b7280")};
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
