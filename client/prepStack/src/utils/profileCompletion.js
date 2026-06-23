export function calculateProfileCompletion(user) {
  if (!user) return 0;

  let completed = 0;
  let total = 0;

  const commonFields = [
    user.name,
    user.bio,
    user.linkedin,
    user.github,
    user.profilePicture,
  ];

  total += commonFields.length;

  commonFields.forEach((field) => {
    if (field && field !== "" && field !== null) {
      completed++;
    }
  });

  if (user?.skills?.length > 0) {
    completed++;
  }

  total++;

  if (user.role === "interviewer") {
    total += 3;

    if (user.category) completed++;

    if (user.experience > 0) completed++;

    if (user.currentCompany) completed++;
  }

  return Math.round((completed / total) * 100);
}
