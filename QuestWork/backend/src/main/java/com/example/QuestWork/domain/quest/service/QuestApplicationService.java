package com.example.QuestWork.domain.quest.service;

import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.quest.constant.ApplicationStatus;
import com.example.QuestWork.domain.quest.dto.QuestApplicationResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestSubmissionRequestDto;
import com.example.QuestWork.domain.quest.dto.QuestSubmissionResponseDto;
import com.example.QuestWork.domain.quest.dto.QuestUpdateSubmissionRequestDto;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.entity.QuestApplication;
import com.example.QuestWork.domain.quest.entity.QuestSubmission;
import com.example.QuestWork.domain.quest.repository.QuestApplicationRepository;
import com.example.QuestWork.domain.quest.repository.QuestRepository;
import com.example.QuestWork.domain.quest.repository.QuestSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class QuestApplicationService {

    private final QuestRepository questRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final QuestApplicationRepository questApplicationRepository;
    private final QuestSubmissionRepository questSubmissionRepository;


    //퀘스트 지원 대답
    @Transactional
    public QuestApplicationResponseDto applyQuest(Long questId, Long userId) {
        Quest quest = getQuest(questId);
        MemberProfileEntity member = getMemberProfile(userId);

        if (questApplicationRepository.existsByQuestAndMemberAndStatus(quest, member, ApplicationStatus.APPLIED)) {
            throw new IllegalStateException("이미 지원한 퀘스트입니다.");
        }

        QuestApplication application = QuestApplication.create(quest, member);
        QuestApplication savedApplication = questApplicationRepository.save(application);

        return QuestApplicationResponseDto.from(savedApplication);
    }

    //퀘스트 제출 대답
    @Transactional
    public QuestSubmissionResponseDto submitQuest(Long questId, Long userId, QuestSubmissionRequestDto requestDto) {
        Quest quest = getQuest(questId);
        MemberProfileEntity member = getMemberProfile(userId);

        questApplicationRepository.findByQuestAndMember(quest, member)
                .orElseThrow(() -> new IllegalStateException("퀘스트에 먼저 참가해야, 제출할 수 있습니다"));

        if (questSubmissionRepository.findByQuestAndMember(quest, member).isPresent()) {
            throw new IllegalStateException("이미 제출한 결과가 있습니다. 업데이트 버튼를 사용하세요.");
        }

        QuestSubmission submission = QuestSubmission.create(
                quest,
                member,
                requestDto.getSubmissionTitle(),
                requestDto.getSubmissionContent(),
                requestDto.getFileUrl(),
                requestDto.getRepoUrl()
        );
        QuestSubmission savedSubmission = questSubmissionRepository.save(submission);
        return QuestSubmissionResponseDto.from(savedSubmission);
    }

    //제출한 제출물 수정 대답
    @Transactional
    public QuestSubmissionResponseDto updateSubmission(Long submissionId, Long userId, QuestUpdateSubmissionRequestDto requestDto) {
        MemberProfileEntity member = getMemberProfile(userId);

        QuestSubmission submission = questSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("제출 정보를 찾을 수 없습니다."));

        validateSubmissionOwner(submission, member);

        submission.updateSubmission(
                requestDto.getSubmissionTitle(),
                requestDto.getSubmissionContent(),
                requestDto.getFileUrl(),
                requestDto.getRepoUrl()
        );

        return QuestSubmissionResponseDto.from(submission);
    }
    // 지원한 퀘스트 취소 대답
    @Transactional
    public void cancelApplication(Long applicationId, Long userId) {
        MemberProfileEntity member = getMemberProfile(userId);

        QuestApplication application = questApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원 정보를 찾을 수 없습니다."));

        if (!application.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 지원만 취소할 수 있습니다.");
        }

        application.cancel();
    }

    // 특정 퀘스트에 대한 지원 정보 조회 (userId 기준, APPLIED 상태만)
    public QuestApplicationResponseDto getMyApplication(Long questId, Long userId) {
        Quest quest = getQuest(questId);
        MemberProfileEntity member = getMemberProfile(userId);
        return questApplicationRepository.findByQuestAndMember(quest, member)
                .filter(a -> a.getStatus() == ApplicationStatus.APPLIED)
                .map(QuestApplicationResponseDto::from)
                .orElse(null);
    }

    // 제출물 단건 조회
    public QuestSubmissionResponseDto getSubmission(Long submissionId) {
        QuestSubmission submission = questSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("제출 정보를 찾을 수 없습니다."));
        return QuestSubmissionResponseDto.from(submission);
    }

    //퀘스트 퀘스트아이디 받아오기
    private Quest getQuest(Long questId) {
        return questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("퀘스트를 찾을 수 없습니다."));
    }
    //멤버 유저아이디 받아오기
    private MemberProfileEntity getMemberProfile(Long memberId) {
        return memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
    }
    //실제 유저가 가지고 있는 제출물인지 검증
    private void validateSubmissionOwner(QuestSubmission submission, MemberProfileEntity member) {
        if(!submission.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인이 제출물만 수정할 수 있습니다");
        }
    }

}
