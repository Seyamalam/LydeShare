import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  rideDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  rideTime: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  rideStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4f9e5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#34C759',
    marginLeft: 6,
    fontWeight: '500',
  },
  locationContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  locationLine: {
    width: 2,
    height: 24,
    backgroundColor: '#007AFF',
    marginTop: 4,
    marginLeft: 7,
    opacity: 0.3,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#1c1c1e',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f7',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverIcon: {
    marginRight: 8,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  vehicleInfo: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 2,
  },
  rideDetails: {
    alignItems: 'flex-end',
  },
  fareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginLeft: 2,
  },
}); 