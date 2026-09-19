package driveme.service;


import java.util.List;
import java.util.Map;
import driveme.model.Payment;
import driveme.model.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import driveme.dao.rideDaoImpl;
import driveme.dto.RideRequestNotificationDTO;
import driveme.dto.RideRequestStatusDTO;
import driveme.model.OfferRide;
import driveme.model.User;

@Service
public class rideServiceImpl {

	@Autowired
	private rideDaoImpl rideDao;
	
	public boolean saveUser(User usr) {
		return rideDao.saveUser(usr);
	}

	/**
	 * Same insert as saveUser(User), but lets the real exception (e.g. a
	 * DuplicateKeyException for a UNIQUE usr_name, or a connectivity error if
	 * MySQL isn't reachable) propagate instead of being swallowed. Used by
	 * AuthApiController#signup so the JSON error response reflects the actual
	 * cause rather than a generic guess.
	 */
	public void saveUserStrict(User usr) {
		rideDao.saveUserStrict(usr);
	}
	
	public User checkUser(String usrName,String password) {
		return rideDao.checkUser(usrName, password);
	}
	
	public boolean saveOfferRide(OfferRide offerRide ) {
		return rideDao.saveOfferRide(offerRide);
	}
	
	public List<OfferRide> searchRide(String ride_start_point,String ride_end_point,String ride_start_date) {
		return rideDao.searchRide(ride_start_point, ride_end_point, ride_start_date);
	}
	public boolean saveRideRequest(Long rr_map_or, Long rr_user_id) {
		return rideDao.saveRideRequest(rr_map_or, rr_user_id);
	}

	public List<RideRequestNotificationDTO> getIncomingRideRequests(Long driverUserId) {
		return rideDao.getIncomingRideRequests(driverUserId);
	}

	public void markIncomingRideRequestsSeen(Long driverUserId) {
		rideDao.markIncomingRideRequestsSeen(driverUserId);
	}

	public boolean respondToRideRequest(Long reqId, Long driverUserId, String newStatus) {
		return rideDao.respondToRideRequest(reqId, driverUserId, newStatus);
	}

	public List<RideRequestStatusDTO> getMyRideRequests(Long riderUserId) {
		return rideDao.getMyRideRequests(riderUserId);
	}

	public void markMyRideRequestsSeen(Long riderUserId) {
		rideDao.markMyRideRequestsSeen(riderUserId);
	}

	public Map<String,Object> userProfile(User usr) {
		return rideDao.userProfile(usr);
	}
	public boolean savePaymentInformation(Payment payment) {
		return rideDao.savePaymentInformation(payment);
		
	}
	public boolean saveReviewInformation(Review review) {
		return rideDao.saveReviewInformation(review);
		
	}

	public boolean updateUser(User usr) {
		// TODO Auto-generated method stub
		return rideDao.updateUser(usr);
	}
}
