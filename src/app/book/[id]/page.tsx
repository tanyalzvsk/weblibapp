"use client";

import { PageWrapper, Menu, BookInfoSection, ReviewCard } from "@/components";
import Modal from "react-modal";
import style from "./page.module.css";
import background from "../../../../public/page-background-main.png";
import classNames from "classnames";
import { Poppins } from "@/fonts";
import { useCallback, useEffect, useState, useContext } from "react";
import { API_URL } from "@/constants";
import { IBook, ICollection, IReview } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { WriteReviewButton } from "@/components/WriteReviewButton";
import ReviewForm from "@/components/ReviewForm/ReviewForm";
import { Typography, Card, Flex, Tabs } from "antd";
import { useAuthCheck, UserContext } from "@/utils";
import { Bounce, toast } from "react-toastify";

const { Title, Text } = Typography;

export default function BookPage() {
  const [filter, setFilter] = useState("reviews");
  const [book, setBook] = useState<IBook | null>(null);
  const [reviews, setReviews] = useState<IReview[] | null>(null);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const params = useParams<{ id: string }>();
  const [isReviewFormVisible, setIsReviewFormVisible] =
    useState<boolean>(false);
  const { accessToken, refreshToken, currentUserId } = useContext(UserContext)!;
  const router = useRouter();
  
  useAuthCheck(router);

  const loadReviews = useCallback(async () => {
    const reviewResponse = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify({
        book_id: params.id,
      }),
    });

    const reviewData: {
      success: boolean;
      reviews: IReview[];
    } = await reviewResponse.json();

    if (reviewData.success) {
      setReviews(reviewData.reviews);
    }
  }, [params.id, accessToken, refreshToken]);

  const loadBook = useCallback(async () => {
    const bookResponse = await fetch(`${API_URL}/search/id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        LibAuthentication: accessToken || "",
        LibRefreshAuthentication: refreshToken || "",
      },
      body: JSON.stringify(`${params.id}`),
    });

    const bookData: IBook = await bookResponse.json();

    if (!bookData.success && bookData.message) {
      toast(bookData.message, {
        autoClose: 2000,
        transition: Bounce,
        closeOnClick: true,
        type: "error",
      });

      return;
    }
    setBook(bookData);
    loadReviews();
  }, [loadReviews, params.id, accessToken, refreshToken]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  return (
    <PageWrapper backgroundSrc={background.src} className={style.page}>
      <Modal
        isOpen={isReviewFormVisible}
        onRequestClose={() => {
          setIsReviewFormVisible(false);
        }}
        className={style.modal}
        overlayClassName={style.overlay}
      >
        <ReviewForm
          userId={currentUserId}
          bookId={+params.id}
          onSuccess={() => {
            setIsReviewFormVisible(false);
            loadReviews();
          }}
        />
      </Modal>

      <Menu />

      <Flex className={style.pageContent}>
        {book && <BookInfoSection {...book} />}

        <Tabs
          defaultActiveKey="reviews"
          activeKey={filter}
          onChange={setFilter}
          className={style.tabsWrapper}
          type="card"
          style={{ color: "white" }}
          tabBarStyle={{
            padding: "16px 18px",
            borderRadius: "25px 0 25px 0",
            transition: "0.3s",
          }}
          items={[
            {
              key: "reviews",
              label: (
                <span
                  style={{
                    color:
                      filter === "reviews" ? "rgba(43, 19, 19, 0.7)" : "white ",
                    fontSize: "18px",
                  }}
                >
                  reviews
                </span>
              ),

              children: (
                <Flex
                  gap={20}
                  style={{ flexWrap: "wrap", justifyContent: "space-between" }}
                >
                  <WriteReviewButton
                    handleClick={() =>
                      setIsReviewFormVisible((state) => !state)
                    }
                  />
                  {reviews &&
                    reviews.map((item) => (
                      <ReviewCard key={item.review_id} {...item} />
                    ))}
                </Flex>
              ),
            },
            {
              key: "collections",
              label: (
                <span
                  style={{
                    color:
                      filter === "collections"
                        ? "rgba(43, 19, 19, 0.7)"
                        : "white ",
                    fontSize: "18px",
                  }}
                >
                  collections
                </span>
              ),
              children: (
                <Flex gap={20}>
                  <Title level={2} style={{ color: "white" }}>
                    No collections available for this book.
                  </Title>
                </Flex>
              ),
            },
            {
              key: "quotes",
              label: (
                <span
                  style={{
                    color:
                      filter === "quotes" ? "rgba(43, 19, 19, 0.7)" : "white ",
                    fontSize: "18px",
                  }}
                >
                  quotes
                </span>
              ),
              children: (
                <Flex gap={20}>
                  {[1, 2, 3].map((item) => (
                    <Card className={style.quote} key={item}>
                      <Title
                        level={3}
                        className={classNames(style.title, Poppins.className)}
                        style={{ color: "white" }}
                      >
                        Tomas Li the {item}
                      </Title>

                      <Text
                        className={classNames(
                          style.description,
                          Poppins.className
                        )}
                        style={{ color: "white" }}
                      >
                        &#34;A powerful story set in the Deep South, tackling
                        themes of racism and injustice through the eyes of a
                        young girl.&#34;
                      </Text>
                    </Card>
                  ))}
                </Flex>
              ),
            },
          ]}
        ></Tabs>
      </Flex>
    </PageWrapper>
  );
}
