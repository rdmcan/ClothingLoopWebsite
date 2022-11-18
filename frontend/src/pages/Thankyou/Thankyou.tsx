import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

//Project resources
import { TwoColumnLayout } from "../../components/Layouts";

export interface IProps {
  heading: string;
  subheading: string;
  confirmationEmail: string;
}

function Content({ heading, subheading, confirmationEmail }: IProps) {
  let history = useHistory();
  const { t } = useTranslation();

  return (
    <main>
      <h1 className="tw-font-serif tw-font-bold tw-text-2xl tw-text-secondary">
        {heading}
      </h1>
      <p className="tw-text-lg">{subheading}</p>
      <p>{confirmationEmail}</p>
      <p>{t("happySwapping")}</p>
      <div className="tw-flex tw-flex-row tw-justify-start">
        <button
          className="tw-btn tw-btn-primary tw-btn-outline"
          onClick={() => history.push("/")}
        >
          {t("home")}
        </button>
        <button
          className="tw-btn tw-btn-primary"
          onClick={() => history.push("/about")}
        >
          {t("About")}
        </button>
      </div>
    </main>
  );
}

export function NewLoopConfirmation(props: any) {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>The Clothing Loop | New Loop Confirmation</title>
        <meta name="description" content="New Loop Confirmation" />
      </Helmet>
      <TwoColumnLayout
        img="/images/party-image.jpg"
        children={
          <Content
            heading={t("thankYouForStartingThisLoop")}
            subheading={t("youAreUnlockingTheClothesSwapPotential")}
            confirmationEmail={t("hostConfirmationEmailIsOnItsWay")}
          />
        }
      ></TwoColumnLayout>
    </>
  );
}

export function JoinLoopConfirmation(props: any) {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>The Clothing Loop | Thank you for joining</title>
        <meta name="description" content="Thank you for joining" />
      </Helmet>
      <TwoColumnLayout
        img="/images/party-image.jpg"
        children={
          <Content
            heading={t("thankYouForSigningUp")}
            subheading={t("yourClosetIsAboutToBecomeAWholeLotMoreSustainable")}
            confirmationEmail={t("confirmationEmailIsOnItsWay")}
          />
        }
      ></TwoColumnLayout>
    </>
  );
}
