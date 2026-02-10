import { useState, useEffect } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import styled from "styled-components";

interface RegionRes {
  code: string;
  description: string;
}

interface DistrictRes {
  code: string;
  description: string;
}

interface RegionSelectorProps<T extends Record<string, any>> {
  control: Control<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  regionCode: Path<T>;
  districtCode: Path<T>;
}

export default function RegionSelector<T extends Record<string, any>>({
  control,
  errors,
  setValue,
  regionCode,
  districtCode,
}: RegionSelectorProps<T>) {
  const [regions, setRegions] = useState<RegionRes[]>([]);
  const [districts, setDistricts] = useState<DistrictRes[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Region 목록 조회
  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Failed to fetch regions:", err));
  }, []);

  // Region 선택 시 District 목록 조회
  useEffect(() => {
    console.log("[useEffect] selectedRegion =", selectedRegion);
    if (selectedRegion) {
      fetch(`/api/regions/districts?region=${selectedRegion}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setDistricts(data);
        })
        .catch((err) => console.error("Failed to fetch districts:", err));
    } else {
      setDistricts([]);
    }
  }, [selectedRegion]);

  return (
    <>
      <InputGroup>
        <Label>지역 (시/도)</Label>
        <Controller
          name={regionCode}
          control={control}
          rules={{ required: "지역을 선택해주세요" }}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(e) => {
                const value = e.target.value;

                field.onChange(value);
                setSelectedRegion(value);
                setValue(districtCode, "" as PathValue<T, typeof districtCode>);
              }}
            >
              <option value="">지역을 선택해주세요</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.description}
                </option>
              ))}
            </Select>
          )}
        />
        {errors[regionCode] && (
          <ErrorText>{errors[regionCode]?.message as string}</ErrorText>
        )}
      </InputGroup>

      <InputGroup>
        <Label>지역 (시/군/구)</Label>
        <Controller
          name={districtCode}
          control={control}
          rules={{ required: "시/군/구를 선택해주세요" }}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value ?? ""}
              disabled={!selectedRegion || districts.length === 0}
            >
              <option value="">시/군/구를 선택해주세요</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.description}
                </option>
              ))}
            </Select>
          )}
        />
        {errors[districtCode] && (
          <ErrorText>{errors[districtCode]?.message as string}</ErrorText>
        )}
      </InputGroup>
    </>
  );
}

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorText = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ff4444;
`;
