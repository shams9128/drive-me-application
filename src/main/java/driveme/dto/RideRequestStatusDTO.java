package driveme.dto;

/**
 * One ride request a rider has made, from the rider's point of view — used
 * to notify them once the driver accepts or rejects it (mirrors
 * RideRequestNotificationDTO, which is the same row from the driver's side).
 * status is null/empty (or "pending") until the driver responds, then
 * "accepted" or "rejected".
 */
public class RideRequestStatusDTO {

	private Long reqId;
	private String driverFirstName;
	private String driverLastName;
	private String driverContact;
	private String rideStartPoint;
	private String rideEndPoint;
	private String rideStartDate;
	private String rideStartTime;
	private String status;
	private boolean seenByRider;

	public Long getReqId() {
		return reqId;
	}

	public void setReqId(Long reqId) {
		this.reqId = reqId;
	}

	public String getDriverFirstName() {
		return driverFirstName;
	}

	public void setDriverFirstName(String driverFirstName) {
		this.driverFirstName = driverFirstName;
	}

	public String getDriverLastName() {
		return driverLastName;
	}

	public void setDriverLastName(String driverLastName) {
		this.driverLastName = driverLastName;
	}

	public String getDriverContact() {
		return driverContact;
	}

	public void setDriverContact(String driverContact) {
		this.driverContact = driverContact;
	}

	public String getRideStartPoint() {
		return rideStartPoint;
	}

	public void setRideStartPoint(String rideStartPoint) {
		this.rideStartPoint = rideStartPoint;
	}

	public String getRideEndPoint() {
		return rideEndPoint;
	}

	public void setRideEndPoint(String rideEndPoint) {
		this.rideEndPoint = rideEndPoint;
	}

	public String getRideStartDate() {
		return rideStartDate;
	}

	public void setRideStartDate(String rideStartDate) {
		this.rideStartDate = rideStartDate;
	}

	public String getRideStartTime() {
		return rideStartTime;
	}

	public void setRideStartTime(String rideStartTime) {
		this.rideStartTime = rideStartTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isSeenByRider() {
		return seenByRider;
	}

	public void setSeenByRider(boolean seenByRider) {
		this.seenByRider = seenByRider;
	}
}
