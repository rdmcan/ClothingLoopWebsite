// React / plugins
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Redirect, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

// Material UI
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import Button from "@material-ui/core/Button";
import { makeStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import theme from "../util/theme";
import ThreeColumnLayout from "../components/ThreeColumnLayout";

// Project resources
import {
  PhoneFormField,
  TextForm,
  CheckboxField,
} from "../components/FormFields";
import GeocoderSelector from "../components/GeocoderSelector";
import AppIcon from "../images/clothing-loop.png";
import { createUser } from "../util/firebase/user";
import { getChain } from "../util/firebase/chain";
import { IChain } from "../types";

const Signup = () => {
  const { chainId } = useParams<{ chainId: string }>();
  const [chain, setChain] = useState<IChain | null>(null);
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [geocoderResult, setGeocoderResult] = useState({
    result: { place_name: "" },
  });
  const [error, setError] = useState("");
  const classes = makeStyles(theme as any)();
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [actionsNewsletterOpen, setActionsNewsletterOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;

  const validate = Yup.object({
    name: Yup.string()
      .min(2, "Must be more than 2 characters")
      .required("Required"),
    email: Yup.string().email("Please enter a valid e-mail address"),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, {
        message: "Please enter valid phone number",
      })
      .required("Required"),
    newsletter: Yup.boolean(),
    actionsNewsletter: Yup.boolean(),
  });

  // Get chain id from the URL and save to state
  useEffect(() => {
    (async () => {
      if (chainId) {
        const chain = await getChain(chainId);
        setChain(chain);
      }
    })();
  }, [chainId]);

  // Gather data from form, validate and send to firebase
  const onSubmit = async (formData: any) => {
    // TODO: allow only full addresses

    try {
      let user = {
        ...formData,
        address: geocoderResult.result.place_name,
        chainId: chainId,
      };
      console.log(`creating user: ${JSON.stringify(user)}`);
      // TODO: do something with validation info for new user (e.g. display this)
      await createUser(user);
      setSubmitted(true);
    } catch (e:any) {
      console.error(`Error creating user: ${JSON.stringify(e)}`);
      setError(e.message);
    }
  };

  const newsletterClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setNewsletterOpen(true);
  }

  const actionsNewsletterClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setActionsNewsletterOpen(true);
  }

  const privacyPolicyClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setPrivacyPolicyOpen(true);
  }

  if (submitted) {
    return <Redirect to={"/thankyou"} />;
  } else {
    return (
      <>
        <Helmet>
          <title>Clothing-Loop | Signup user</title>
          <meta name="description" content="Signup user" />
        </Helmet>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phoneNumber: "",
            newsletter: false,
            actionsNewsletter: false,
          }}
          validationSchema={validate}
          onSubmit={(v) => onSubmit(v)}
        >
          {(formik) => (
            <ThreeColumnLayout>
              <div>
                <img
                  src={AppIcon}
                  alt="SFM logo"
                  width="500"
                  className={classes.image}
                />
                <Typography variant="h3" className={classes.pageTitle}>
                  {t("Signup to ")}
                  {chain?.name}
                </Typography>
                <Typography component="p" className="explanatory-text">
                  {
                    "please fill out the information below to join the selected clothing loop"
                  }
                </Typography>

                <Form>
                  <TextForm
                    label="Name"
                    name="name"
                    type="text"
                    required
                    className={classes.textField}
                  />
                  <TextForm
                    label="Email"
                    name="email"
                    type="email"
                    required
                    className={classes.textField}
                  />

                  <PhoneFormField
                    label="Phone number"
                    name="phoneNumber"
                    onChange={(e: string) =>
                      formik.setFieldValue("phoneNumber", e)
                    }
                  />
                  <GeocoderSelector
                    name="address"
                    onResult={setGeocoderResult}
                  />

                  <CheckboxField
                    label={<>Subscribe to <a href="#newsletter" onClick={newsletterClick} id="newsletterPopup">The Clothing Loop Newsletter</a></>}
                    name="newsletter"
                    type="checkbox"
                  />
                  <CheckboxField
                    label={<>Subscribe to <a href="#actionsNewsletter" onClick={actionsNewsletterClick} id="actionsNewsletterPopup">Slow Fashion Movement Newsletter</a></>}
                    name="actionsNewsletter"
                    type="checkbox"
                  />
                  <p>
                    Data will be used in accordance with our <a href="#privacyPolicy" onClick={privacyPolicyClick} id="newsletterPopup">Privacy Policy</a>
                  </p>
                  {error ? <Alert severity="error">{error}</Alert> : null}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    {t("signup")}
                  </Button>
                </Form>
              </div>
            </ThreeColumnLayout>
          )}
        </Formik>
      <Dialog
        open={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"The Clothing Loop Newsletter"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Pellentesque ullamcorper eget nisi sed facilisis. 
            Proin feugiat a risus ac iaculis. Nunc commodo nulla id magna faucibus, et elementum diam ultrices. 
            Suspendisse et lorem aliquam sapien finibus cursus. Nam id arcu sem. 
            Quisque facilisis odio et erat pretium, ac interdum diam posuere. 
            Nunc vulputate molestie quam, sit amet finibus velit mattis eget. Pellentesque molestie malesuada tincidunt. 
            Proin a luctus mauris. Donec tortor justo, hendrerit sit amet turpis ac, interdum consectetur magna.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewsletterOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={actionsNewsletterOpen}
        onClose={() => setActionsNewsletterOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Slow Fashion Movement Newsletter"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Pellentesque ullamcorper eget nisi sed facilisis. 
            Proin feugiat a risus ac iaculis. Nunc commodo nulla id magna faucibus, et elementum diam ultrices. 
            Suspendisse et lorem aliquam sapien finibus cursus. Nam id arcu sem. 
            Quisque facilisis odio et erat pretium, ac interdum diam posuere. 
            Nunc vulputate molestie quam, sit amet finibus velit mattis eget. Pellentesque molestie malesuada tincidunt. 
            Proin a luctus mauris. Donec tortor justo, hendrerit sit amet turpis ac, interdum consectetur magna.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionsNewsletterOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Privacy Policy"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We are buying more and more garments and wearing them shorter and
            shorter. The Clothing Loop tackles this growing problem – while
            connecting people in the neighborhood in a fun and sustainable
            way. The idea of the Clothing Loop is simple: (large) bags filled
            with clothing travel a route past all participants in a particular
            city or neighborhood. Do you receive the bag at home? Then you can
            take out what you like and put back something that is still in
            good condition, but ready for a new owner. If you want, you can
            share a photo with your new addition in the corresponding WhatsApp
            group. Then you take the bag to the next neighbor on the list. We
            started a year ago in Amsterdam in the Netherlands as a
            corona-proof, local alternative for clothing swap events and now
            have more than 7500 participants spread over more than 210 chains
            across the country. The success has now been picked up by numerous
            (national) media (see for example: NOS). Our goal is to spread
            this initiative globally. To this end, we are building an online
            platform where anyone, anywhere can start or join a chain.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyPolicyOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }
};

export default Signup;