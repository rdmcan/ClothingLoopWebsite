//Resources
import { TwoColumnLayout } from "../components/Layouts";
import { AuthContext } from "../providers/AuthProvider";
import { purge } from "../api/user";
import { ToastContext } from "../providers/ToastProvider";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { authUser } = useContext(AuthContext);

  const history = useHistory(); 
  const { addToastStatic} = useContext(ToastContext);
  function deleteClicked() {
    addToastStatic({
      message: ("Deletion is Permanent: Proceed?"),
      type: "warning",
      actions: [ {
        text: t("Continue"),
        type: "ghost",
        fn: () => { 
          purge(authUser?.uid);
          console.log("User");
          history.push("/users/logout");},
      },]
    });
  }

  return (
    <main className="pt-10">
      {authUser && (
        <TwoColumnLayout img="https://ucarecdn.com/6ac2be4c-b2d6-4303-a5a0-c7283759a8e9/-/resize/x600/-/format/auto/-/quality/smart/denise.png">
          <div className="md:pl-10 md:pr-20 flex flex-col items-center justify-center text-center max-md:mb-10">
            <h3 className="font-serif font-bold text-5xl text-secondary mb-8">{`Hello, ${authUser?.name}`}</h3>
            <p className="mb-6">{t("thankYouForBeingHere")}</p>

            <Link className="btn btn-primary mb-4" to="/loops">
              {t("viewLoops")}
            </Link>

            <Link
              className="btn btn-primary btn-link text-base block mb-4"
              target="_blank"
              to={{
                pathname:
                  "https://drive.google.com/drive/folders/1iMJzIcBxgApKx89hcaHhhuP5YAs_Yb27",
              }}
            >
              {t("goToTheToolkitFolder")}
            </Link>

            <div className="relative align-bottom">
              <button
                className="btn btn-primary bg-red block"
                onClick={deleteClicked}
              >
                {t("Delete User")}
              </button>
            </div>
          </div>
        </TwoColumnLayout>
      )}
    </main>
  );
}
