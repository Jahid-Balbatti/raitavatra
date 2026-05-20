import { collection, addDoc, getDocs, serverTimestamp, query, limit } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { CropCategory } from "../types";

const INITIAL_TIPS = [
  {
    cropCategory: CropCategory.PADDY,
    instruction: "Use azolla as bio-fertilizer to increase nitrogen content in the field. This can reduce urea dependency by 30%.",
    instructionKn: "ಗದ್ದೆಯಲ್ಲಿ ಸಾರಜನಕದ ಅಂಶವನ್ನು ಹೆಚ್ಚಿಸಲು ಅಜೋಲ್ಲಾವನ್ನು ಜೈವಿಕ ಗೊಬ್ಬರವಾಗಿ ಬಳಸಿ. ಇದು ಯೂರಿಯಾ ಅವಲಂಬನೆಯನ್ನು 30% ರಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
    imageUrl: "https://www.farmatma.in/wp-content/uploads/2018/01/paddy-cultivation.jpg",
  },
  {
    cropCategory: CropCategory.ARECA_NUT,
    instruction: "Maintain proper drainage during monsoon to prevent root rot disease. Ensure water does not stagnate around the base.",
    instructionKn: "ಬೇರು ಕೊಳೆ ರೋಗವನ್ನು ತಡೆಗಟ್ಟಲು ಮುಂಗಾರು ಅವಧಿಯಲ್ಲಿ ಸರಿಯಾದ ಬಸಿಗಾಲುವೆ ವ್ಯವಸ್ಥೆಯನ್ನು ನಿರ್ವಹಿಸಿ. ಗಿಡದ ಬುಡದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
  },
  {
    cropCategory: CropCategory.COCONUT,
    instruction: "Apply green manure and compost in the basin to improve soil texture and moisture retention.",
    instructionKn: "ಮಣ್ಣಿನ ವಿನ್ಯಾಸ ಮತ್ತು ತೇವಾಂಶ ಉಳಿಸಿಕೊಳ್ಳುವಿಕೆಯನ್ನು ಸುಧಾರಿಸಲು ಪಾತಿಯಲ್ಲಿ ಹಸಿರೆಲೆ ಗೊಬ್ಬರ ಮತ್ತು ಪೆಟ್ಟಿಗೆ ಗೊಬ್ಬರವನ್ನು ಅನ್ವಯಿಸಿ.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMOGobi8rQR75NP2zyWKhI2mldBu34QxjKRkPOglRN6NTASlTez_yOlHOmPhhjj8AYKuufEPR5XKOTFNdXZnc96EozQb_4QiiEwRE8wA&s=10",
  },
  {
    cropCategory: CropCategory.TOMATO,
    instruction: "Avoid overhead irrigation in the evening to reduce late blight risk. Using mulch helps keep the fruit dry.",
    instructionKn: "ಲೇಟ್ ಬ್ಲೈಟ್ ಅಪಾಯವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಸಂಜೆ ವೇಳೆ ಮೇಲಿಂದ ನೀರುಣಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ. ಹೊದಿಕೆ ಬಳಸುವುದರಿಂದ ಹಣ್ಣು ಒಣದಾಗಿರಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=1000&auto=format&fit=crop",
  }
];

const INITIAL_STORIES = [
  {
    farmerName: "Shiva Gowda",
    story: "After following the azolla technique, Shiva saw a 20% increase in yield while saving ₹5000 on fertilizers.",
    storyKn: "ಅಜೋಲ್ಲಾ ತಂತ್ರವನ್ನು ಅನುಸರಿಸಿದ ನಂತರ, ಶಿವ ಅವರು ರಸಗೊಬ್ಬರಗಳ ಮೇಲೆ ₹ 5000 ಉಳಿಸುವ ಜೊತೆಗೆ ಇಳುವರಿಯಲ್ಲಿ 20% ಹೆಚ್ಚಳವನ್ನು ಕಂಡರು.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
    location: "Shimoga",
  }
];

export async function seedDatabase() {
  const tipsRef = collection(db, "tips");
  let tipsSnap;
  try {
    tipsSnap = await getDocs(query(tipsRef, limit(100)));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "tips");
    return;
  }
  
  if (tipsSnap.empty) {
    console.log("Seeding tips...");
    for (const tip of INITIAL_TIPS) {
      try {
        await addDoc(tipsRef, { ...tip, createdAt: serverTimestamp() });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "tips");
      }
    }
  } else {
    console.log("Tips collection already seeded.");
  }

  const storiesRef = collection(db, "successStories");
  let storiesSnap;
  try {
    storiesSnap = await getDocs(query(storiesRef, limit(1)));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, "successStories");
    return;
  }

  if (storiesSnap.empty) {
    console.log("Seeding stories...");
    for (const story of INITIAL_STORIES) {
      try {
        await addDoc(storiesRef, { ...story, createdAt: serverTimestamp() });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, "successStories");
      }
    }
  }
}
