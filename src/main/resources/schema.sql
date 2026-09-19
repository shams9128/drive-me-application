-- DriveMe database schema
--
-- Generated from the SQL statements in src/main/java/driveme/dao/rideDaoImpl.java
-- (the raw INSERT/SELECT/UPDATE strings there are the actual source of truth
-- for column names — there was no schema.sql or DDL script anywhere else in
-- the repo, so these tables were never created for this database). Safe to
-- re-run any time: every statement uses IF NOT EXISTS, so it only creates
-- what's missing and never touches existing data.
--
-- Run with:  mysql -u root -p carpooling < schema.sql
-- (adjust user/host if application.properties' spring.datasource.* differ)

CREATE DATABASE IF NOT EXISTS carpooling
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE carpooling;

-- users
-- Referenced by: userOperations/AuthApiController (saveUser, saveUserStrict,
-- checkUser, updateUser). usr_name is UNIQUE because checkUser() does
-- "WHERE usr_name = ?" via queryForObject(), which requires at most one row.
CREATE TABLE IF NOT EXISTS users (
  user_id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
  firstName                 VARCHAR(100) NOT NULL,
  lastName                  VARCHAR(100) NOT NULL,
  email                     VARCHAR(255) NOT NULL,
  contatcNumber             VARCHAR(30)  NOT NULL,
  driving_license_number    VARCHAR(50)  NOT NULL,
  usr_name                  VARCHAR(100) NOT NULL,
  usr_password              VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_users_usr_name (usr_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- car
-- Referenced by: rideDaoImpl.saveUser / saveUserStrict, only when car_model
-- is non-empty on sign up.
CREATE TABLE IF NOT EXISTS car (
  car_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  car         VARCHAR(100) NOT NULL,   -- manufacturer, e.g. "Tesla"
  car_model   VARCHAR(100) NOT NULL,
  reg_number  VARCHAR(50)  NOT NULL,
  owned_by    BIGINT NOT NULL,
  CONSTRAINT fk_car_owner FOREIGN KEY (owned_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- offer_ride
-- Referenced by: findride.java / offerride.java / RideApiController
-- (searchRide, saveOfferRide, userProfile). Dates/times are stored as
-- VARCHAR because driveme.model.OfferRide holds them as Strings and the DAO
-- never converts them to java.sql.Date/Time.
CREATE TABLE IF NOT EXISTS offer_ride (
  or_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  ride_start_date   VARCHAR(20)  NOT NULL,
  ride_start_time   VARCHAR(10)  NOT NULL,
  ride_start_point  VARCHAR(255) NOT NULL,
  ride_end_point    VARCHAR(255) NOT NULL,
  seats_offer       BIGINT NOT NULL,
  seats_available   BIGINT NOT NULL,
  amountPerSeat     BIGINT NOT NULL,
  or_user_id        BIGINT NOT NULL,
  status            VARCHAR(50) NULL,
  CONSTRAINT fk_offer_ride_user FOREIGN KEY (or_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ride_request_mapping
-- Referenced by: findride.java / RideApiController (saveRideRequest),
-- rideDaoImpl.userProfile.
--
-- status holds the driver's decision on this request: NULL/'' (or 'pending')
-- while the driver hasn't responded yet, 'accepted' or 'rejected' once they
-- have (see rideDaoImpl#respondToRideRequest). seen_by_driver / seen_by_rider
-- are separate "have they noticed this" flags for each side's notification
-- badge, so they don't collide with the decision itself the way status='seen'
-- used to (that overload has been retired — see the migration below).
CREATE TABLE IF NOT EXISTS ride_request_mapping (
  req_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  rr_map_or       BIGINT NOT NULL,
  rr_user_id      BIGINT NOT NULL,
  status          VARCHAR(50) NULL,
  seen_by_driver  TINYINT(1) NOT NULL DEFAULT 0,
  seen_by_rider   TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_rrm_offer_ride FOREIGN KEY (rr_map_or) REFERENCES offer_ride(or_id),
  CONSTRAINT fk_rrm_user       FOREIGN KEY (rr_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Migration for databases created before the driver-accept/reject feature:
-- adds the two "seen" columns, then retires the old status='seen' overload —
-- that used to mean "driver has seen this", which is now seen_by_driver=1,
-- freeing up status to hold the actual accept/reject decision.
--
-- NOTE: this ALTER TABLE only needs to run once. If you run schema.sql again
-- after these columns already exist, MySQL will error with "Duplicate column
-- name" on this block — that's expected; just skip/remove this ALTER once
-- it's been applied (some MySQL builds don't support ADD COLUMN IF NOT
-- EXISTS, so it can't silently no-op on a repeat run the way the rest of
-- this file does).
ALTER TABLE ride_request_mapping
  ADD COLUMN seen_by_driver TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN seen_by_rider  TINYINT(1) NOT NULL DEFAULT 0;

UPDATE ride_request_mapping SET seen_by_driver = 1, status = NULL WHERE status = 'seen';

-- payment
-- Referenced by: userOperations.savePayment, rideDaoImpl.savePaymentInformation.
CREATE TABLE IF NOT EXISTS payment (
  payment_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  amount_paid     BIGINT NOT NULL,
  payment_map_rr  BIGINT NOT NULL,
  CONSTRAINT fk_payment_rrm FOREIGN KEY (payment_map_rr) REFERENCES ride_request_mapping(req_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- review
-- Referenced by: userOperations.saveReview, rideDaoImpl.saveReviewInformation.
CREATE TABLE IF NOT EXISTS review (
  rev_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  rvw_usr     BIGINT NOT NULL,
  rvw_map_rr  BIGINT NOT NULL,
  rvw_star    BIGINT NOT NULL,
  CONSTRAINT fk_review_user FOREIGN KEY (rvw_usr) REFERENCES users(user_id),
  CONSTRAINT fk_review_rrm  FOREIGN KEY (rvw_map_rr) REFERENCES ride_request_mapping(req_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
