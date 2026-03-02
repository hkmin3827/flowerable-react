import { useState, useEffect } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { InputGroup, Label, Select, ErrorText } from "./RegionSelector.styles";

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

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Failed to fetch regions:", err));
  }, []);

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
