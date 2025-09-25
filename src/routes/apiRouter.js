import express from "express";

import postAppCookie from "../controllers/api/auth/postGoogleAuthAccessToken.js";

import getS3UploadUrl from "../controllers/getS3UploadUrl.js";

import changePassword from "../controllers/api/auth/changePassword.js";
import confirmEmail from "../controllers/api/auth/confirmEmail.js";
import emailLogin from "../controllers/api/auth/emailLogin.js";
import emailSignup from "../controllers/api/auth/emailSignup.js";
import resendEmailForConfirmation from "../controllers/api/auth/resendEmailForConfirmation.js";
import updateUser from "../controllers/api/auth/updateUser.js";
import forgotPassword from "../controllers/api/auth/forgotPassword.js";

import loginWithGoogle from "../controllers/api/auth/loginWithGoogle.js";

import getLoggedInUser from "../controllers/api/getLoggedInUser.js";
import generateLoginOTP from "../controllers/api/auth/generateLoginOTP.js";
import loginWithOTP from "../controllers/api/auth/loginWithOTP.js";

import postContent from "../controllers/api/content/postContent.js";
import editContent from "../controllers/api/content/editContent.js";
import deleteContent from "../controllers/api/content/deleteContent.js";
import getFeedItems from "../controllers/api/content/getFeedItems.js";

import postFollowOrUnfollow from "../controllers/api/follow/postFollowOrUnfollow.js";

import postLike from "../controllers/api/likes/postLike.js";

import getNotificationCount from "../controllers/api/notifications/getNotificationCount.js";
import getNotifications from "../controllers/api/notifications/getNotifications.js";

import getProfileDoc from "../controllers/api/profile/getProfileDoc.js";

import searchProfiles from "../controllers/api/search/searchProfiles.js";
import searchContent from "../controllers/api/search/searchContent.js";

import postCommentOrReply from "../controllers/api/comments/postCommentOrReply.js";
import getComments from "../controllers/api/comments/getComments.js";
import getReplies from "../controllers/api/comments/getReplies.js";
import editCommentOrReply from "../controllers/api/comments/editCommentOrReply.js";
import deleteCommentOrReply from "../controllers/api/comments/deleteCommentOrReply.js";
import getStates from "../controllers/api/getStates.js";
import getCountries from "../controllers/api/getCountries.js";
import getCities from "../controllers/api/getCities.js";
import getContent from "../controllers/api/content/getContent.js";
import getProfiles from "../controllers/api/profile/getProfiles.js";
import getUsersWhoLiked from "../controllers/api/likes/getUsersWhoLiked.js";
import postGoogleAuthAccessToken from "../controllers/api/auth/postGoogleAuthAccessToken.js";
import postReport from "../controllers/api/report/postReport.js";
import postReportDecision from "../controllers/api/report/postReportDecision.js";
import getReports from "../controllers/api/report/getReports.js";
import addOrEditAdminData from "../controllers/api/admin/addOrEditAdminData.js";
import getAdminData from "../controllers/api/admin/getAdminData.js";
import deleteItem from "../controllers/api/delete/DeleteItem.js";

const router = express.Router();

// Content
router.post("/content", postContent);
router.patch("/content", editContent);
router.delete("/content", deleteContent);
router.get("/feed", getFeedItems);
router.get("/content", getContent);

// Follow
router.post("/follow", postFollowOrUnfollow);

// Likes
router.post("/like", postLike);
router.get("/user-list-of-likes", getUsersWhoLiked);

// Notifications
router.get("/notifications-count", getNotificationCount);
router.get("/notifications", getNotifications);

//App cookie
router.post("/google-auth-access-token", postGoogleAuthAccessToken);

// Profile
router.get("/profile", getProfileDoc);
router.get("/profiles", getProfiles);

// Search
router.get("/search-profiles", searchProfiles);
router.get("/search-content", searchContent);

// Comments
router.post("/comment", postCommentOrReply);
router.get("/comments", getComments);
router.get("/replies", getReplies);
router.patch("/comment", editCommentOrReply);
router.delete("/comment", deleteCommentOrReply);

router.use("/logged-in-user", getLoggedInUser);
router.post("/app-cookie", postAppCookie);
router.get("/s3-upload-url", getS3UploadUrl);
router.post("/login-with-google", loginWithGoogle);

//Admin data
router.get("/admin-data", getAdminData);
router.post("/admin-data", addOrEditAdminData);

//Delete
router.post("/delete", deleteItem);

// Auth
router.post("/change-password", changePassword);
router.post("/confirm-email", confirmEmail);
router.post("/email-login", emailLogin);
router.post("/generate-otp", generateLoginOTP);
router.post("/login-with-otp", loginWithOTP);
router.post("/email-signup", emailSignup);
router.post("/forgot-password", forgotPassword);
router.post("/resend-email-for-confirmation", resendEmailForConfirmation);

router.patch("/me", updateUser);

router.get("/search-profiles", searchProfiles);
router.get("/search-content", searchContent);

//locations
router.get("/countries", getCountries);
router.get("/states", getStates);
router.get("/cities", getCities);

//Reports
router.get("/reports", getReports);
router.post("/report", postReport);
router.post("/report-decision", postReportDecision);

router.get("*", function (req, res, next) {
  return next("404");
});

export default router;
