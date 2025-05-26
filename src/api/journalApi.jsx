const API_LINK="https://vdft9knjc2.execute-api.ap-southeast-2.amazonaws.com/dev"

export async function createJournalEntry(data) {
  try {
    const response = await fetch(
      `${API_LINK}/journal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw error;
  }
}


export async function getJournalByID(id) {
  try {
    const response = await fetch(
      `${API_LINK}/get-journal-by-id?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting journal entry:", error);
    throw error;
  }
}

export async function getJournalByUserID(userID) {
  try {
    const response = await fetch(
      `${API_LINK}/journals?userId=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting journal entry:", error);
    throw error;
  }
}