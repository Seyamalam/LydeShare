import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100, // Add padding for floating dock
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tripDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  tripId: {
    fontSize: 14,
    color: "#666",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#34C759",
  },
  dropoffDot: {
    backgroundColor: "#FF3B30",
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#eee",
    marginHorizontal: 10,
  },
  locationDetails: {
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  driverCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  driverPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  vehicleInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  plateNumber: {
    fontSize: 14,
    color: "#666",
  },
  ratingCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
