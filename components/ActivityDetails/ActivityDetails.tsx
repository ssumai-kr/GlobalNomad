import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { ActivityDetailsProps } from './ActivityDetails.types';
import { formatNumberToFixed } from '@/utils/formatNumberToFixed';
import ImageContainer from './ImageContainer/ImageContainer';
import Map from './Map/Map';
import { formatCurrency } from '@/utils/formatCurrency';
import Reservation from './Reservation/Reservation';
import { MeatballButton } from '../Button/Button';
import useClickOutside from '@/hooks/useClickOutside';
import Pagination from '../Pagination/Pagination';
import {
  getActivityInfo,
  getActivityReviews,
} from '@/pages/api/activities/apiactivities';
import {
  getActivityInfoResponse,
  getActivityReviewsResponse,
} from '@/pages/api/activities/apiactivities.types';
import Spinner from '../Spinner/Spinner';

export default function ActivityDetails({ id }: ActivityDetailsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(
    router.query.page ? parseInt(router.query.page as string, 10) : 1
  );
  const itemsPerPage = 3;

  const menuRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const {
    data: activityData,
    error: activityError,
    isLoading: isLoadingActivity,
  } = useQuery<getActivityInfoResponse>({
    queryKey: ['activityDetails', id],
    queryFn: () => getActivityInfo({ id }),
  });

  const {
    data: reviewData,
    error: reviewError,
    isLoading: isLoadingReviews,
  } = useQuery<getActivityReviewsResponse>({
    queryKey: ['reviewList', id, currentPage],
    queryFn: () =>
      getActivityReviews({ id, page: currentPage, size: itemsPerPage }),
  });

  if (isLoadingActivity || isLoadingReviews) {
    return <Spinner />;
  }

  if (activityError || reviewError) {
    console.error(
      'Error fetching activity details:',
      activityError || reviewError
    );
    return <div>Error fetching activity details</div>;
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getRatingText = (rating: number): string => {
    if (rating >= 4 && rating <= 5) {
      return '매우만족';
    } else if (rating >= 3 && rating < 4) {
      return '만족';
    } else if (rating >= 2 && rating < 3) {
      return '보통';
    } else if (rating >= 1 && rating < 2) {
      return '약간만족';
    } else {
      return '평가 없음';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/activity-details/${id}?page=${page}`);
  };

  const paginatedReviews = reviewData?.reviews || [];

  return (
    <div className="mt-16 t:mt-4 m:mt-4">
      <div className="relative flex justify-between m:px-[24px]">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-nomad-black">{activityData?.category}</p>
          <h1 className="text-[32px] text-nomad-black font-bold m:text-[24px] m:max-w-[300px] m:overflow-hidden m:whitespace-nowrap m:text-ellipsis">
            {activityData?.title}
          </h1>
          <div className="flex gap-3">
            <div className="flex gap-1">
              <Image
                src="/icon/icon_star_on.svg"
                alt="별점 아이콘"
                width={16}
                height={16}
              />
              <p className="m:text-sm">
                {activityData && formatNumberToFixed(activityData?.rating)}
              </p>
              <p className="m:text-sm">
                ({formatCurrency(activityData?.reviewCount)})
              </p>
            </div>
            <div className="flex gap-1">
              <Image
                src="/icon/location.svg"
                alt="위치 아이콘"
                width={18}
                height={18}
              />
              <p className="text-nomad-black m:text-sm">
                {activityData?.address}
              </p>
            </div>
          </div>
        </div>
        <MeatballButton onClick={toggleMenu} />
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute top-[70px] right-0 mt-2 w-40 h-[114px] bg-white border border-var-gray3 border-solid rounded-lg flex flex-col items-center justify-center text-lg z-10"
          >
            <button className="block w-full h-[57px] px-4 py-2 text-var-gray8 hover:bg-gray-100 rounded-t-lg border-b border-var-gray3 border-solid">
              수정하기
            </button>
            <button className="block w-full h-[57px] px-4 py-2 text-var-gray8 hover:bg-gray-100 rounded-b-lg">
              삭제하기
            </button>
          </div>
        )}
      </div>
      {activityData && (
        <ImageContainer
          bannerImageUrl={activityData.bannerImageUrl}
          subImages={activityData.subImages}
        />
      )}
      <div className="flex gap-4 m:block m:relative">
        <div className="max-w-[800px] mb-20 t:w-[470px] m:w-fit m:px-[24px]">
          <div className="border-t-2 border-var-gray3 border-solid pt-10 m:pt-6" />
          <div className="flex flex-col gap-4">
            <p className="text-nomad-black font-bold text-xl">체험 설명</p>
            <p className="text-nomad-black">{activityData?.description}</p>
          </div>
          <div className="border-t-2 border-var-gray3 border-solid my-10 m:my-6" />
          {activityData && <Map address={activityData.address} />}
          <div className="flex gap-1 mt-2">
            <Image
              src="/icon/location.svg"
              alt="위치 아이콘"
              width={18}
              height={18}
            />
            <p className="text-nomad-black text-sm max-w-[700px] overflow-hidden whitespace-nowrap text-ellipsis">
              {activityData?.address}
            </p>
          </div>
          <div className="border-t-2 border-var-gray3 border-solid my-10 m:my-6" />
          <div className="flex flex-col gap-4">
            <p className="text-nomad-black font-bold text-xl">후기</p>
            <div className="flex gap-4 items-center">
              <p className="text-[50px] font-bold">
                {activityData && formatNumberToFixed(activityData?.rating)}
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-lg text-nomad-black">
                  {activityData && getRatingText(activityData?.rating)}
                </p>
                <div className="flex items-center gap-1">
                  <Image
                    src="/icon/icon_star_on.svg"
                    alt="별점 아이콘"
                    width={16}
                    height={16}
                  />
                  <p className="text-var-black text-sm">
                    {formatCurrency(activityData?.reviewCount)}개 후기
                  </p>
                </div>
              </div>
            </div>
          </div>
          {reviewData && reviewData.totalCount > 0 && (
            <>
              {paginatedReviews?.map((review, i) => (
                <div
                  key={review.id}
                  className={`flex gap-4 py-6 items-start ${i === paginatedReviews.length - 1 ? '' : 'border-b-2 border-var-gray3 border-solid'}`}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={review.user.profileImageUrl}
                      alt={`${review.user.nickname}의 프로필 이미지`}
                      width={45}
                      height={45}
                      className="rounded-full object-cover border border-var-gray3 border-solid w-12 h-12"
                    />
                  </div>
                  <div>
                    <div className="flex mb-2">
                      <p className="font-bold max-w-[300px] m:max-w-[160px] overflow-hidden whitespace-nowrap text-ellipsis">
                        {review.user.nickname}
                      </p>
                      <p className="mx-2">|</p>
                      <p className="text-sm text-var-gray6">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-nomad-black">{review.content}</p>
                  </div>
                </div>
              ))}
              <Pagination
                totalItems={reviewData.totalCount}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
        <div>{activityData && <Reservation activity={activityData} />}</div>
      </div>
    </div>
  );
}
