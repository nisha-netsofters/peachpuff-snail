import { useEffect, useState } from "react";
import { getCoursesAPI, getEducationsAPI } from "../../apis/education";

const listFromResp = (resp) => {
  if (Array.isArray(resp?.data)) return resp.data;
  if (Array.isArray(resp?.results)) return resp.results;
  if (Array.isArray(resp)) return resp;
  return [];
};

export const useEducationCourseCascade = ({
  qualificationValue = "",
  educationId = "",
} = {}) => {
  const [educationOptions, setEducationOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!qualificationValue) {
        setEducationOptions([]);
        return;
      }
      setEducationLoading(true);
      try {
        const resp = await getEducationsAPI({
          qualification: qualificationValue,
        });
        if (cancelled) return;
        setEducationOptions(
          listFromResp(resp).map((item) => ({
            label: item.name,
            value: item.id,
            educationId: item.id,
            qualification: item.qualification,
            id: "field",
          }))
        );
      } catch (e) {
        if (!cancelled) setEducationOptions([]);
      } finally {
        if (!cancelled) setEducationLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [qualificationValue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!educationId) {
        setCourseOptions([]);
        return;
      }
      setCourseLoading(true);
      try {
        const resp = await getCoursesAPI({ educationId });
        if (cancelled) return;
        setCourseOptions(
          listFromResp(resp).map((item) => ({
            label: item.name,
            value: item.name,
            educationId: item.educationId,
            id: "course",
          }))
        );
      } catch (e) {
        if (!cancelled) setCourseOptions([]);
      } finally {
        if (!cancelled) setCourseLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [educationId]);

  return {
    educationOptions,
    courseOptions,
    educationLoading,
    courseLoading,
  };
};

export default useEducationCourseCascade;
